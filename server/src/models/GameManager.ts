import { WebSocket as WsWebSocketType } from "ws"
import { LUDO_BOARD, Piece, PIECES } from "../constants/board"
import { GameData, games } from "../db"

enum Color {
    red = "red",
    blue = "blue",
    green = "green",
    yellow = "yellow"
}

const winPosition = {
    red: "h7",
    blue: "g8",
    green: "i8",
    yellow: "h9"
}

type PieceColor = "red" | "blue" | "green" | "yellow"


type UserData = {
    ws: WsWebSocketType,
    admin: boolean,
    turn: boolean
    name: string,
    color: Color
    isOnline: boolean
}

export class GameManager {
    gameId: string

    constructor(gameId: string) {
        this.gameId = gameId
    }

    public validateJoinRoom() {
        const game = games[this.gameId];
        if (game?.users.length === 4) {
            return { success: false, message: "Maximum of 4 players can play this game" };
        } else if (game?.isStarted) {
            return { success: false, message: "Game has already started" };
        }
        return { success: true, message: "" };
    }


    addPlayerToRoom(ws: WsWebSocketType, name: string, color: Color, admin: boolean, turn: boolean) {
        const game = games[this.gameId]
        const user: UserData = {
            ws: ws,
            name: name === "" ? `Player ${game?.users.length ? game.users.length + 1: 1}`: name,
            color: color,
            admin: admin,
            isOnline: true,
            turn: turn
        }

        if (!game) {
            games[this.gameId] = {
                isStarted: false,
                pieces: PIECES.slice(0, 4),
                users: [user]
            }
        } else {
            game.users.push(user)
            game.pieces = PIECES.slice(0, games[this.gameId]!.users.length * 4)
        }
    }

    getMovablePieces(user: UserData, dieRoll: number) {
        const game = games[this.gameId]
        if (!game) {
            return []
        }
        return game.pieces.filter((piece) => {
            if (piece.color !== user.color) return false;
            if (piece.position === piece.home && dieRoll === 6) return true;
            const stepsToWin = this.calculateStepsToWin(piece.position, winPosition[piece.color], piece.color);
            return dieRoll <= stepsToWin;
        });
    }

    rotateTurn(user: UserData) {
        const game = games[this.gameId]
        if (!game) return false
        const currentIndex = game.users.indexOf(user);
        game.users[currentIndex].turn = false;
        const nextIndex = (currentIndex + 1) % game.users.length;
        game.users[nextIndex].turn = true;
    }

    calculateStepsToWin(currentPosition: string, winPosition: string, pieceColor: PieceColor): number {
        let steps = 0;
        let square = LUDO_BOARD.flat().find((sq) => sq.id === currentPosition);
        while (square && square.id !== winPosition) {
            if (square[pieceColor]) square = LUDO_BOARD.flat().find((sq) => sq.id === square?.[pieceColor]);
            else square = LUDO_BOARD.flat().find((sq) => sq.id === square?.next);
            steps++;
        }
        return steps;
    }

    public movePiece(piece: Piece, dieRoll: number) {
        if (piece.position === piece.home && dieRoll === 6) {
            piece.position = piece.openPosition;
        } else {
            for (let i = 0; i < dieRoll; i++) {
                const currentSquare = LUDO_BOARD.flat().find((sq) => sq.id === piece.position);
                let nextSquare = LUDO_BOARD.flat().find((sq) => sq.id === currentSquare?.[piece.color]);
                if (!nextSquare) nextSquare = LUDO_BOARD.flat().find((sq) => sq.id === currentSquare?.next);
                console.log(nextSquare);
                piece.position = nextSquare?.id || piece.position;
            }
        }
    }

    public handlePieceCollision(game: GameData, piece: Piece) {
        const collidedPiece = game.pieces.find(
            (p) => p.position === piece.position && p.color !== piece.color
        );
        const safeSquares = LUDO_BOARD.flat(1).filter(p => p.safe).map(p => p.id)
        if (collidedPiece && !safeSquares.includes(piece.position)) {
            collidedPiece.position = collidedPiece.home;
        }
        return (collidedPiece && !safeSquares.includes(piece.position))
    }
}