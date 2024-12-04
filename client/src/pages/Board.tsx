import { LUDO_BOARD } from "@/constants/board";
import { DataContext } from "@/context/DataContext";
import { useContext } from "react";

const Board = () => {
  const { data } = useContext(DataContext);
  return (
    <>
      <div>
        {data.turn && <>ROLL DICE</>}
      </div>
      <div className="board flex flex-col gap-1 w-full max-w-3xl mx-auto p-4 bg-gray-100 border border-gray-300 rounded-lg">
        {LUDO_BOARD.map((row, rowIndex) => (
          <div key={rowIndex} className="row flex gap-1">
            {row.map((square, idx) => {
              if (idx === 0 && rowIndex === 0) console.log(square);

              return (
                <div
                  key={idx}
                  className={`w-8 h-8 flex items-center justify-center border border-gray-400 ${
                    square.color ? `bg-${square.color}-200` : "bg-gray-50"
                  }`}
                >
                  {data.pieces
                    .filter((piece) => piece.position === square.id)
                    .map((piece, pieceIndex) => (
                      <div
                        key={pieceIndex}
                        className={`piece w-6 h-6 rounded-full bg-${piece.color}-500`}
                        title={`Piece (${piece.color})`}
                      ></div>
                    ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default Board;
