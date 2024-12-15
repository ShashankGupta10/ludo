import WebSocket from "ws";
import { GameManager } from "../models/GameManager";
import { Color, games } from "../db";

export const joinRoom = (jsonData: any, ws: WebSocket) => {
    // TODO: Validation for jsonData
    const { roomId, playerName } = jsonData;
    const game = new GameManager(roomId)

    const { success, message } = game.validateJoinRoom()
    if (!success) {
        ws.send(JSON.stringify({ type: "players", success: false, message: message }))
        return;
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
}