import { Button } from "@/components/ui/button";
import { LUDO_BOARD } from "@/constants/board";
import { DataContext } from "@/context/DataContext";
import { WsContext } from "@/context/WsContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";

const Board = () => {
  const { data } = useContext(DataContext);
  const { websocket } = useContext(WsContext);
  const { id: gameId } = useParams();
  const rollDie = () => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      const rollDieEmitData = {
        type: "roll_die",
        gameId: gameId,
      };
      websocket.send(JSON.stringify(rollDieEmitData));
    }
  };
  console.log(data);
  const movePiece = (pieceHomeSquare: string) => {
    const movePieceData = {
      type: "make_move",
      gameId: gameId,
      pieceId: pieceHomeSquare,
      dieRoll: data.roll
    };

    websocket?.send(JSON.stringify(movePieceData));
  };
  return (
    <>
      {data.roll !== 0 && (
        <div>
          {data.name} rolled {data.roll}
        </div>
      )}
      {data.turn && (
        <Button disabled={data.playMove} onClick={rollDie}>
          ROLL DIE
        </Button>
      )}
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
                      <button
                        key={pieceIndex}
                        className={`piece w-6 h-6 rounded-full bg-${
                          piece.color
                        }-500 ${
                          data.playMove && piece.color === data.color
                            ? `shadow-${piece.color}-400 shadow-[0_0_2px_2px] cursor-pointer`
                            : ""
                        }`}
                        title={`Piece (${piece.color})`}
                        onClick={() =>
                          data.playMove &&
                          piece.color === data.color &&
                          movePiece(piece.home)
                        }
                      />
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
