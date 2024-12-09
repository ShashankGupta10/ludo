import http from "http";
import express from "express";
import cors from "cors";
import roomRouter from "./routes/room.route";
import { config } from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
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
    isOnline: boolean
}

type GameData = {
    users: Array<UserData>,
    pieces: Array<Piece>
}

type PieceColor = "red" | "blue" | "green" | "yellow"

const port = process.env.PORT || 5000;

const app = express();
const games: Record<string, GameData> = {};

app.use(express.json());
app.use(cors());
app.use("/api/v1/room", roomRouter);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function calculateStepsToWin(currentPosition: string, winPosition: string, pieceColor: PieceColor): number {
    let steps = 0;
    let square = LUDO_BOARD.flat().find((sq) => sq.id === currentPosition);
    while (square && square.id !== winPosition) {
        if (square[pieceColor]) square = LUDO_BOARD.flat().find((sq) => sq.id === square?.[pieceColor]);
        else square = LUDO_BOARD.flat().find((sq) => sq.id === square?.next);
        steps++;
    }
    return steps;
}

const winPosition = {
    red: "h7",
    blue: "g8",
    green: "i8",
    yellow: "h9"
}

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
                        games[roomId].users = [...(games[roomId]?.users || []), { ws: ws, turn: true, admin: true, name: playerName, color: colorForUser, isOnline: true }];
                    }
                    else games[roomId].users = [...(games[roomId]?.users || []), { ws: ws, turn: false, admin: false, name: playerName === "" ? `Player ${games[roomId].users.length + 1}` : playerName, color: colorForUser, isOnline: true }];

                    // Prepare the list of players (could use unique identifiers later)
                    const players = games[roomId]?.users?.map((player) => { return { name: player.name, isOnline: player.isOnline } });
                    console.log(players);

                    // Broadcast the updated player list to all players in the room
                    games[roomId].users.forEach((client) => {
                        if (client.ws.readyState === WebSocket.OPEN) {
                            client.ws.send(JSON.stringify({ type: "players", data: players, success: true, isAdmin: client.admin }));
                        }
                    });

                    break;
                }

                case "rejoin_room": {
                    const { name, roomId, color } = jsonData
                    console.log(name, roomId, color, games[roomId], games);
                    const user = games[roomId]?.users.find(player => player.name === name && player.color === color)
                    if (user) {
                        user.isOnline = true
                        user.ws = ws
                        const players = games[roomId].users.map((player) => { return { name: player.name, isOnline: player.isOnline } });
                        games[roomId].users.forEach((client) => {
                            if (client.ws.readyState === WebSocket.OPEN) {
                                client.ws.send(JSON.stringify({ type: "players", data: players, success: true, isAdmin: client.admin }));
                            }
                        });
                    }
                }
                case "start_game": {
                    const { gameId } = jsonData
                    const players = games[gameId].users.length

                    if (players === 4) {
                        games[gameId].users.forEach((client) => {
                            if (client.ws.readyState === WebSocket.OPEN) {
                                client.ws.send(JSON.stringify({ type: "start_game", success: true, message: "Game started successfully! Good luck", roomId: gameId, color: client.color, name: client.name }));
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
                    const { gameId, dieRoll, pieceId }: { gameId: string; dieRoll: number, pieceId: string } = jsonData;
                    const game = games[gameId];
                    if (!game) {
                        console.log("GNF");
                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "Game not found." }));
                        break;
                    }

                    const currentPlayer = game.users.find((player) => player.turn);
                    if (!currentPlayer || currentPlayer.ws !== ws) {
                        console.log("NYT");
                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "It's not your turn!" }));
                        break;
                    }

                    // Check if any piece can move
                    const movablePieces = game.pieces.filter((piece) => {
                        if (piece.color !== currentPlayer.color) return false;

                        // If the piece is at home, it needs a 6 to move
                        if (piece.position === piece.home && dieRoll === 6) return true;

                        // If the piece is on the board, check if it can move without exceeding winPosition
                        const stepsToWin = calculateStepsToWin(piece.position, winPosition[piece.color], piece.color);
                        console.log(stepsToWin);
                        return dieRoll <= stepsToWin;
                    });

                    console.log("HERE:", movablePieces);

                    if (movablePieces.length === 0) {
                        // No valid moves, skip turn
                        const currentIndex = game.users.indexOf(currentPlayer);
                        game.users[currentIndex].turn = false;
                        const nextIndex = (currentIndex + 1) % game.users.length;
                        game.users[nextIndex].turn = true;

                        game.users.forEach((client) => {
                            client.ws.send(
                                JSON.stringify({
                                    type: "board_event",
                                    success: true,
                                    pieces: game.pieces,
                                    turn: client.turn,
                                    playMove: false,
                                })
                            );
                        });

                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "No valid moves. Turn skipped." }));
                        break;
                    }

                    // Proceed with normal move logic for the selected piece
                    const piece = game.pieces.find((p) => p.home === pieceId && p.color === currentPlayer.color);
                    if (!piece || !movablePieces.includes(piece)) {
                        console.log("INVALID PIECE");
                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "Invalid piece selected." }));
                        break;
                    }

                    // Move logic (same as before, with collision handling)
                    if (piece.position === piece.home && dieRoll === 6) {
                        piece.position = piece.openPosition;
                    } else {
                        console.log("HERE");
                        for (let i = 0; i < dieRoll; i++) {
                            const currentSquare = LUDO_BOARD.flat().find((sq) => sq.id === piece.position);
                            let nextSquare = LUDO_BOARD.flat().find((sq) => sq.id === currentSquare?.[piece.color]);
                            if (!nextSquare) nextSquare = LUDO_BOARD.flat().find((sq) => sq.id === currentSquare?.next);
                            console.log(nextSquare);
                            piece.position = nextSquare?.id || piece.position;
                        }
                    }

                    // Collision and turn-switching logic remains unchanged
                    const collidedPiece = game.pieces.find(
                        (p) => p.position === piece.position && p.color !== piece.color
                    );
                    const safeSquares = LUDO_BOARD.flat(1).filter(p => p.safe).map(p => p.id)
                    if (collidedPiece && !safeSquares.includes(piece.position)) {
                        collidedPiece.position = collidedPiece.home;
                    }


                    // Notify all players about the updated board state and no collided piece and not on star
                    if (dieRoll === 6 || (collidedPiece && !safeSquares.includes(piece.position))) {
                        game.users.forEach((client) => {
                            client.ws.send(
                                JSON.stringify({
                                    type: "board_event",
                                    success: true,
                                    pieces: game.pieces,
                                    turn: client.turn,
                                    playMove: false,
                                })
                            );
                        });
                    } else {
                        const currentIndex = game.users.indexOf(currentPlayer);
                        game.users[currentIndex].turn = false;
                        const nextIndex = (currentIndex + 1) % game.users.length;
                        game.users[nextIndex].turn = true;
                        game.users.forEach((client) => {
                            client.ws.send(
                                JSON.stringify({
                                    type: "board_event",
                                    success: true,
                                    pieces: game.pieces,
                                    turn: client.turn,
                                    playMove: false,
                                })
                            );
                        });
                    }

                    break;
                }

                case "game_over": {
                    const { gameId } = jsonData
                    const game = games[gameId]
                    if (!game) {
                        ws.send(JSON.stringify({ type: "game_over", success: false, message: "Game not found." }));
                        break;
                    }

                    const winner = game.users.find((player) => {
                        return game.pieces.filter((p) => p.color === player.color && p.position === winPosition[player.color]).length === 4;
                    });

                    game.users.forEach((client) => {
                        client.ws.send(JSON.stringify({ type: "game_over", success: true, winner: winner?.name }));
                    });
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
            games[roomId].users.forEach((client) => {
                if (client.ws === ws) client.isOnline = false
            });

            // Broadcast updated player list to the remaining clients in the room
            const players = games[roomId].users.map((player) => { return { name: player.name, isOnline: player.isOnline } });
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
