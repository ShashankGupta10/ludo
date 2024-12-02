import express, { json } from "express";
import cors from "cors";
import { config, populate } from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import roomRouter from "./routes/room.route";
import { LUDO_BOARD } from "./constants/board";
import { Piece, PIECES } from "./constants/pieces";

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
    board: Array<Array<string>>,
    users: Array<UserData>,
    pieces: Record<string, Array<Piece>>
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
                    const colorForUser = colors[games[roomId].users.length]
                    // Add the WebSocket to the specified room
                    if (games[roomId].users && games[roomId].users.length === 4) {
                        ws.send(JSON.stringify({ type: "players", success: false, message: "Maximum of 4 players can play this game" }))
                        break;
                    }
                    // if (!games[roomId]) ws.send(JSON.stringify({ type: "players", message: "Room does not exist!" }))
                    if (!games[roomId].users) games[roomId].users = [...(games[roomId].users || []), { ws: ws, turn: true, admin: true, name: playerName, color: colorForUser }];
                    else games[roomId].users = [...(games[roomId].users || []), { ws: ws, turn: false, admin: false, name: playerName, color: colorForUser }];

                    // Prepare the list of players (could use unique identifiers later)
                    const players = games[roomId].users.map((player) => player.name);
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
                                client.ws.send(JSON.stringify({ type: "start_game", success: true, message: "Game started successfully! Good luck", roomId: gameId }));
                                client.ws.send(JSON.stringify({ type: "board_event", success: true, board: LUDO_BOARD, turn: client.turn }));
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
                    console.log(dieRoll);
                    const user = games[gameId].users.find(player => player.turn)
                    if (user) {
                        games[gameId].users.forEach(client => {
                            client.ws.send(JSON.stringify({ type: "roll_die", roll: dieRoll, user: user.name, turn: user.turn  }))
                        })
                    }
                    
                }

                case "make_move": {
                    const { gameId, dieRoll, piece } = jsonData
                    const currentBoardState = games[gameId].board
                    const pieces = games[gameId].pieces
                    const user = games[gameId].users.find(user => user.turn)
                    if (user) {
                        const colour = user.color
                        // const piecesPlace = pieces[colour].some(p => p.position !== -1)
                    }
                    const currentPlayer = games[gameId].users.find(player => player.turn)
                    
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
