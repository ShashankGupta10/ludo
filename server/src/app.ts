import http from "http";
import express, { Request, Response } from "express";
import cors from "cors";
import roomRouter from "./routes/room.route";
import { config } from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
import { games } from "./db";
import { handleEvent } from "./events";
config();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/room", roomRouter);
app.get("/", (_: Request, res: Response) => {
    res.send("Pinged the ludo server");
})
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("New WebSocket connection established.");

    ws.on("message", (data) => {
        try {
            const jsonData = JSON.parse(data.toString());
            const { type } = jsonData

            handleEvent(type, jsonData, ws)
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

        Object.keys(games).forEach((roomId) => {
            games[roomId]?.users.forEach((client) => {
                if (client.ws === ws) client.isOnline = false
            });

            const players = games[roomId]?.users.map((player) => { return { name: player.name, isOnline: player.isOnline } });
            games[roomId]?.users.forEach((client) => {
                if (client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(JSON.stringify({ type: "players", data: players, success: true, isAdmin: client.admin }));
                }
            });

            if (games[roomId]?.users.length === 0) delete games[roomId];
        });
    });
});

server.listen(port, () => {
    console.log(`HTTP server and WebSocket server running on port ${port}`);
});
