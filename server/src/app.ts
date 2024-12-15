import http from "http";
import express from "express";
import cors from "cors";
import roomRouter from "./routes/room.route";
import { config } from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./models/GameManager";
import { games } from "./db";
config();

enum Color {
    red = "red",
    blue = "blue",
    green = "green",
    yellow = "yellow"
}

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/room", roomRouter);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

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
                    // TODO: Validation for jsonData
                    const { roomId, playerName } = jsonData;
                    const game = new GameManager(roomId)

                    const { success, message } = game.validateJoinRoom()
                    if (!success) {
                        ws.send(JSON.stringify({ type: "players", success: false, message: message }))
                        break;
                    }

                    const colors = [Color.red, Color.blue, Color.green, Color.yellow]
                    const colorForUser = colors[games[roomId]?.users.length || 0]

                    const gameCreator = !games[roomId]
                    game.addPlayerToRoom(ws, playerName, colorForUser, gameCreator, gameCreator)

                    games[roomId]!.users.forEach((client) => {
                        if (client.ws.readyState === WebSocket.OPEN) {
                            client.ws.send(JSON.stringify({ type: "players", data: games[roomId]?.users, success: true, isAdmin: client.admin }));
                        }
                    });
                    break;
                }

                case "start_game": {
                    const { gameId } = jsonData
                    const game = games[gameId]

                    if (!game) {
                        ws.send(JSON.stringify({ type: "start_game", success: false, message: "Game does not exist!!" }))
                        break;
                    }

                    const players = game.users.length
                    if (players > 1) {
                        game.isStarted = true
                        game.users.forEach((client) => {
                            if (client.ws.readyState === WebSocket.OPEN) {
                                client.ws.send(JSON.stringify({ type: "start_game", success: true, message: "Game started successfully! Good luck", roomId: gameId, color: client.color }));
                                client.ws.send(JSON.stringify({ type: "board_event", success: true, pieces: games[gameId]?.pieces, turn: client.turn }));
                            }
                        });
                    } else ws.send(JSON.stringify({ type: "start_game", success: false, message: "You need more than 1 player to start a game of LUDO" }))
                    break;
                }

                case "roll_die": {
                    const { gameId } = jsonData
                    const game = games[gameId]

                    if (!game) {
                        ws.send(JSON.stringify({ type: "start_game", success: false, message: "Game does not exist!!" }))
                        break;
                    }
                    const gameManager = new GameManager(gameId)

                    const dieRoll = Math.floor(Math.random() * 6) + 1
                    const user = game.users.find(player => player.turn)

                    if (!user) {
                        ws.send(JSON.stringify({ type: "join_room", success: false, "message": "User does not exist!!" }))
                        break;
                    }
                    const movablePieces = gameManager.getMovablePieces(user, dieRoll)
                    console.log(movablePieces);

                    if (movablePieces.length === 0) {
                        // No valid moves, skip turn
                        gameManager.rotateTurn(user)
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
                    // cjeck if all of the users pieces are on the home square
                    const userPiecesOnHome = game.pieces.filter(
                        (p) => p.color === user.color && p.position === p.home
                    ).length;
                    const playMove = dieRoll === 6 || userPiecesOnHome !== 4

                    if (!playMove) gameManager.rotateTurn(user)

                    game.users.forEach((client) => {
                        client.ws.send(JSON.stringify({ type: "roll_die", roll: dieRoll, user: user.name }));
                        client.ws.send(JSON.stringify({
                            type: "board_event",
                            pieces: game.pieces,
                            turn: client.turn,
                            playMove
                        }));
                    });
                    break;
                }

                case "make_move": {
                    const { gameId, dieRoll, pieceId }: { gameId: string; dieRoll: number, pieceId: string } = jsonData;
                    const game = games[gameId];
                    if (!game) {
                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "Game not found." }));
                        break;
                    }
                    const gameManager = new GameManager(gameId)
                    const currentPlayer = game.users.find((player) => player.turn);
                    if (!currentPlayer || currentPlayer.ws !== ws) {
                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "It's not your turn!" }));
                        break;
                    }

                    // Check if any piece can move
                    const movablePieces = gameManager.getMovablePieces(currentPlayer, dieRoll)

                    if (movablePieces.length === 0) {
                        // No valid moves, skip turn
                        gameManager.rotateTurn(currentPlayer)
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
                        ws.send(JSON.stringify({ type: "make_move", success: false, message: "Invalid piece selected." }));
                        break;
                    }

                    gameManager.movePiece(piece, dieRoll)

                    const collisionHappened = gameManager.handlePieceCollision(game, piece)
                    const retainTurn = dieRoll === 6 || collisionHappened

                    if (!retainTurn) gameManager.rotateTurn(currentPlayer)

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
            games[roomId]?.users.forEach((client) => {
                if (client.ws === ws) client.isOnline = false
            });

            // Broadcast updated player list to the remaining clients in the room
            const players = games[roomId]?.users.map((player) => { return { name: player.name, isOnline: player.isOnline } });
            games[roomId]?.users.forEach((client) => {
                if (client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(JSON.stringify({ type: "players", data: players, success: true, isAdmin: client.admin }));
                }
            });

            // Clean up empty rooms
            if (games[roomId]?.users.length === 0) {
                delete games[roomId];
            }
        });
    });
});

server.listen(port, () => {
    console.log(`HTTP server and WebSocket server running on port ${port}`);
});
