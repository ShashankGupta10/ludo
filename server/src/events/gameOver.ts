import WebSocket from "ws";
import { games } from "../db";
import { GameManager } from "../models/GameManager";

export const gameOver = (jsonData: any, ws: WebSocket) => {
    const { gameId } = jsonData
    const game = games[gameId]
    if (!game) {
        ws.send(JSON.stringify({ type: "game_over", success: false, message: "Game not found." }));
        return;
    }

    const gameManager = new GameManager(gameId)
    const winner = gameManager.checkWinner(game)

    game.users.forEach((client) => {
        client.ws.send(JSON.stringify({ type: "game_over", success: true, winner: winner?.name }));
    });
}