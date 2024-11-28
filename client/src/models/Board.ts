import { BoardSquare, LUDO_BOARD, Piece, PIECES } from "../constants/board";

class Board {
    board: Array<Array<BoardSquare>>;
    pieces: Record<string, Array<Piece>>;
    gameId: string;
    
    constructor(gameId: string) {
        this.board = LUDO_BOARD;
        this.pieces = PIECES
        this.gameId = gameId;
    }

    // updateBoard(gameId: string, dieRoll: number, pieceId: number) {
                        
    // }

    getBoard() {
        return this.board;
    }
}

export default Board;