import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import roomRouter from "./routes/room.route";

config();

const port = process.env.PORT || 5000;

const app = express();
const games: Record<string, Array<WebSocket>> = {};

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
                    const { roomId } = jsonData;

                    // Add the WebSocket to the specified room
                    // if (!games[roomId]) ws.send(JSON.stringify({ type: "players", message: "Room does not exist!" }))
                    games[roomId] = [...(games[roomId] || []), ws];

                    // Prepare the list of players (could use unique identifiers later)
                    const players = games[roomId].map((_, index) => `Player ${index + 1}`);

                    // Broadcast the updated player list to all players in the room
                    games[roomId].forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: "players", data: players, success: true }));
                        }
                    });

                    break;
                }

                case "start_game": {
                    const { gameId } = jsonData
                    const players = games[gameId].length
                    if (players === 4) {
                        games[gameId].forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({ type: "start_game", success: true, message: "Game started successfully! Good luck" }));
                            }
                        });
                    } else {
                        ws.send(JSON.stringify({ type: "start_game", success: false, message: "You need 4 players to start a game" }))
                    }
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
            games[roomId] = games[roomId].filter((client) => client !== ws);

            // Broadcast updated player list to the remaining clients in the room
            const players = games[roomId].map((_, index) => `Player ${index + 1}`);
            games[roomId].forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "players", data: players, success: true }));
                }
            });

            // Clean up empty rooms
            if (games[roomId].length === 0) {
                delete games[roomId];
            }
        });
    });
});

server.listen(port, () => {
    console.log(`HTTP server and WebSocket server running on port ${port}`);
});
