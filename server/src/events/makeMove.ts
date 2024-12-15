import WebSocket from "ws";
import { games } from "../db";
import { GameManager } from "../models/GameManager";

export const makeMove = (jsonData: any, ws: WebSocket) => {
    const { gameId, dieRoll, pieceId }: { gameId: string; dieRoll: number, pieceId: string } = jsonData;
    const game = games[gameId];
    if (!game) {
        ws.send(JSON.stringify({ type: "make_move", success: false, message: "Game not found." }));
        return
    }
    const gameManager = new GameManager(gameId)
    const currentPlayer = game.users.find((player) => player.turn);
    if (!currentPlayer || currentPlayer.ws !== ws) {
        ws.send(JSON.stringify({ type: "make_move", success: false, message: "It's not your turn!" }));
        return
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
        return
    }

    // Proceed with normal move logic for the selected piece
    const piece = game.pieces.find((p) => p.home === pieceId && p.color === currentPlayer.color);
    if (!piece || !movablePieces.includes(piece)) {
        ws.send(JSON.stringify({ type: "make_move", success: false, message: "Invalid piece selected." }));
        return;
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
    return;
}