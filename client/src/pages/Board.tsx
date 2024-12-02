import { PIECES, LUDO_BOARD } from "@/constants/board";
import "./../App.css";
// import { useContext } from "react";
// import { WsContext } from "@/context/WsContext";

const Board = () => {
  // const { websocket } = useContext(WsContext)

  // const getPieceInSquare = (squareId: string) => {
  //   for (const color in PIECES) {
  //     const piece = PIECES[color].find((p) => p.position === squareId);
  //     if (piece) {
  //       return { ...piece, color };
  //     }
  //   }
  //   return null;
  // };

  return (
    <div className="board">
      {LUDO_BOARD.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((square) => {
            // const piece = getPieceInSquare(square.id);
            return (
              <div
                key={square.id || `${rowIndex}-${Math.random()}`}
                className={`square ${square.colour}`}
              >
                {/* {piece && (
                  <div
                    className={`piece ${piece.color}`}
                    title={`Piece ${piece.id} (${piece.color})`}
                  >
                    {piece.id}
                  </div>
                )} */}
                <div
                    className={`piece ${square.colour}`}
                    title={`Piece ${square.id} (${square.colour})`}
                  >
                    {square.id}
                  </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
