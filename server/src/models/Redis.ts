import { createClient, RedisClientType,  } from 'redis';
import { v4 as uuid } from 'uuid';
import { BoardSquare, LUDO_BOARD } from '../constants/board';
import { Piece, PIECES } from '../constants/pieces';

type Colours = "red" | "yellow" | "green" | "blue";

interface Game {
    id: string;
    board: Array<Array<BoardSquare>>;
    pieces: Record<string, Array<Piece>>;
}

export class RedisClient {
    client: RedisClientType
    constructor() {
        this.client = createClient()
    }

  async createGame() {
        const id = uuid();
        const newGame: Game = {
            id: id,
            board: LUDO_BOARD,
            pieces: PIECES
        };

        await this.client.publish(id, JSON.stringify(newGame))
        return id;
    }

    async playMove(gameId: string, player: Colours, dieRoll: number, pieceId: number) {
        const game = await this.client.get(gameId)
        if (!game) return null;

        const currentGame: Game = JSON.parse(game);
        const piece = currentGame.pieces[player].find(p => p.id === pieceId);
        if (!piece) {
            return;
        }

        const currentPosition = piece.position;
        const newPosition = currentPosition + dieRoll;
        const newPiece = { ...piece, position: newPosition };
        const newPieces = currentGame.pieces.red.map(p => {
            if (p.id === pieceId) {
                return newPiece;
            }
            return p;
        });
        currentGame.pieces[player] = newPieces;
        this.client.set(gameId, JSON.stringify(currentGame));
    }

    public addPlayersToGame(gameId: string, ws: WebSocket) {
        this.client.rPush(`${gameId}:clients`, JSON.stringify(ws));
    }
}
