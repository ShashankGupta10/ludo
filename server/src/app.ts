import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import roomRouter from "./routes/room.route";
import { LUDO_BOARD, Piece, PIECES } from "./constants/board";

config();

enum Color {
    red = "red",
    blue = "blue",
    green = "green",
    yellow = "yellow"
}

type UserData = {
    ws: WebSocket,
    admin: boolean,
    turn: boolean
    name: string,
    color: Color
}

type GameData = {
    users: Array<UserData>,
    pieces: Array<Piece>
}

const port = process.env.PORT || 5000;

const app = express();
const games: Record<string, GameData> = {};

app.use(express.json());
app.use(cors());
app.use("/api/v1/room", roomRouter);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("New WebSocket connection established.");

    ws.on("message", (data) => {
        try {
            const jsonData = JSON.parse(data.toString());
            console.log("Received message:", jsonData);

            switch (jsonData.type) {
                case "join_room": {
                    const { roomId, playerName } = jsonData;
                    const colors = [Color.red, Color.blue, Color.green, Color.yellow]
                    const colorForUser = colors[games[roomId]?.users.length || 0]
                    // Add the WebSocket to the specified room
                    if (games[roomId]?.users && games[roomId]?.users?.length === 4) {
                        ws.send(JSON.stringify({ type: "players", success: false, message: "Maximum of 4 players can play this game" }))
                        break;
                    }
                    // if (!games[roomId]) ws.send(JSON.stringify({ type: "players", message: "Room does not exist!" }))
                    if (!games[roomId] || !games[roomId].users) {
                        games[roomId] = {
                            pieces: PIECES,
                            users: []
                        }
                        games[roomId].users = [...(games[roomId]?.users || []), { ws: ws, turn: true, admin: true, name: playerName, color: colorForUser }];
                    }
                    else games[roomId].users = [...(games[roomId]?.users || []), { ws: ws, turn: false, admin: false, name: playerName, color: colorForUser }];

                    // Prepare the list of players (could use unique identifiers later)
                    const players = games[roomId]?.users?.map((player) => player.name);
                    console.log(players);

                    // Broadcast the updated player list to all players in the room
                    games[roomId].users.forEach((client) => {
                        if (client.ws.readyState === WebSocket.OPEN) {
                            client.ws.send(JSON.stringify({ type: "players", data: players, success: true, isAdmin: client.admin }));
                        }
                    });

                    break;
                }

                case "start_game": {
                    const { gameId } = jsonData
                    const players = games[gameId].users.length

                    if (players === 4) {
                        games[gameId].users.forEach((client) => {
                            if (client.ws.readyState === WebSocket.OPEN) {
                                client.ws.send(JSON.stringify({ type: "start_game", success: true, message: "Game started successfully! Good luck", roomId: gameId, color: client.color }));
                                client.ws.send(JSON.stringify({ type: "board_event", success: true, pieces: games[gameId].pieces, turn: client.turn }));
                            }
                        });
                    } else {
                        ws.send(JSON.stringify({ type: "start_game", success: false, message: "You need 4 players to start a game" }))
                    }
                    break;
                }

                case "roll_die": {
                    const { gameId } = jsonData
                    const dieRoll = Math.floor(Math.random() * 6) + 1
                    const user = games[gameId].users.find(player => player.turn)

                    if (user) {
                        if (dieRoll !== 6) {
                            const userPiecesOnHome = games[gameId].pieces.filter(
                                (p) => p.color === user.color && p.position === p.home
                            ).length;
                            console.log(userPiecesOnHome);
                            if (userPiecesOnHome === 4) {
                                const indexOfCurrentPlayer = games[gameId].users.indexOf(user)
                                games[gameId].users[indexOfCurrentPlayer].turn = false
                                if (indexOfCurrentPlayer === games[gameId].users.length - 1) {
                                    games[gameId].users[0].turn = true
                                } else {
                                    games[gameId].users[indexOfCurrentPlayer + 1].turn = true
                                }
                                games[gameId].users.forEach(client => {
                                    client.ws.send(JSON.stringify({ type: "roll_die", roll: dieRoll, user: user.name }))
                                    client.ws.send(JSON.stringify({ type: "board_event", pieces: games[gameId].pieces, turn: client.turn, playMove: false }))
                                })
                            } else {
                                games[gameId].users.forEach(client => {
                                    client.ws.send(JSON.stringify({ type: "roll_die", roll: dieRoll, user: user.name }))
                                    client.ws.send(JSON.stringify({ type: "board_event", pieces: games[gameId].pieces, turn: client.turn, playMove: true }))
                                })
                            }
                        } else {
                            games[gameId].users.forEach(client => {
                                client.ws.send(JSON.stringify({ type: "roll_die", roll: dieRoll, user: user.name }))
                                client.ws.send(JSON.stringify({ type: "board_event", pieces: games[gameId].pieces, turn: client.turn, playMove: true }))
                            })
                        }
                    }
                    break;
                }

                case "make_move": {
                    const { gameId, dieRoll, pieceId }: { gameId: string, dieRoll: number, pieceId: string } = jsonData;
                    const game = games[gameId];
                    if (!game) {
                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "Game not found." }));
                        break;
                    }

                    const currentPlayer = game.users.find((player) => player.turn);
                    if (!currentPlayer || currentPlayer.ws !== ws) {
                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "It's not your turn!" }));
                        break;
                    }

                    const piece = game.pieces.find((p) => p.home === pieceId && p.color === currentPlayer.color);
                    if (!piece) {
                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "Invalid piece selected." }));
                        break;
                    }

                    // Check if the piece can move
                    if (piece.position === piece.home && dieRoll !== 6) {
                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "You need a 6 to move out of home." }));
                        break;
                    }

                    // Move piece out of home if roll is 6
                    if (piece.position === piece.home && dieRoll === 6) {
                        piece.position = piece.openPosition;
                    } else {
                        // Update position on the board
                        for (let i = 0; i < dieRoll; i++) {
                            const currentSquare = LUDO_BOARD.flat().find((sq) => sq.id === piece.position);
                            const nextSquare = LUDO_BOARD.flat().find((sq) => sq.id === currentSquare?.next);
                            piece.position = nextSquare?.id || piece.position;
                        }
                    }

                    // Handle collisions (send opponent's piece home)
                    const collidedPiece = game.pieces.find(
                        (p) => p.position === piece.position && p.color !== piece.color
                    );
                    if (collidedPiece) {
                        collidedPiece.position = collidedPiece.home;
                    }

                    // Notify all players about the updated board state
                    if (dieRoll !== 6) {
                        const currentIndex = game.users.indexOf(currentPlayer);
                        game.users[currentIndex].turn = false;
                        const nextIndex = (currentIndex + 1) % game.users.length;
                        game.users[nextIndex].turn = true;
                    }

                    game.users.forEach((client) => {
                        client.ws.send(
                            JSON.stringify({
                                type: "board_event",
                                success: true,
                                pieces: game.pieces,
                                turn: client.turn,
                                playMove: false
                            })
                        );
                    });
                    break;
                }

                default:
                    console.warn("Unhandled message type:", jsonData.type);
                    break;
            }
        } catch (error) {
            console.error("Error handling message:", error);
            ws.send(
                JSON.stringify({
                    type: "error",
                    message: "Invalid message format.",
                })
            );
        }
    });

    ws.on("close", () => {
        console.log("WebSocket connection closed.");

        // Remove the WebSocket from all rooms
        Object.keys(games).forEach((roomId) => {
            games[roomId].users = games[roomId].users.filter((client) => client.ws !== ws);

            // Broadcast updated player list to the remaining clients in the room
            const players = games[roomId].users.map((player) => player.name);
            games[roomId].users.forEach((client) => {
                if (client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(JSON.stringify({ type: "players", data: players, success: true, isAdmin: client.admin }));
                }
            });

            // Clean up empty rooms
            if (games[roomId].users.length === 0) {
                delete games[roomId];
            }
        });
    });
});

server.listen(port, () => {
    console.log(`HTTP server and WebSocket server running on port ${port}`);
});
