import WebSocket from "ws";
import { games } from "../db";

export const startGame = (jsonData: any, ws: WebSocket) => {
    const { gameId } = jsonData
    const game = games[gameId]

    if (!game) {
        ws.send(JSON.stringify({ type: "start_game", success: false, message: "Game does not exist!!" }))
        return
    }

    const players = game.users.length
    if (players > 1) {
        game.isStarted = true
        game.users.forEach((client) => {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify({ type: "start_game", success: true, message: "Game started successfully! Good luck", roomId: gameId, color: client.color }));
                client.ws.send(JSON.stringify({ type: "board_event", success: true, pieces: game.pieces, turn: client.turn }));
            }
        });
    } else ws.send(JSON.stringify({ type: "start_game", success: false, message: "You need more than 1 player to start a game of LUDO" }))
}