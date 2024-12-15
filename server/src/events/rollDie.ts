import WebSocket from "ws";
import { games } from "../db";
import { GameManager } from "../models/GameManager";

export const rollDie = (jsonData: any, ws: WebSocket) => {
    const { gameId } = jsonData
    const game = games[gameId]

    if (!game) {
        ws.send(JSON.stringify({ type: "start_game", success: false, message: "Game does not exist!!" }))
        return
    }
    const gameManager = new GameManager(gameId)

    const dieRoll = Math.floor(Math.random() * 6) + 1
    const user = game.users.find(player => player.turn)

    if (!user) {
        ws.send(JSON.stringify({ type: "join_room", success: false, "message": "User does not exist!!" }))
        return
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
}