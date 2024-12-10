/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { Avatar } from "@/components/ui/avatar";
import { LUDO_BOARD } from "@/constants/board";
import { DataContext } from "@/context/DataContext";
import { WsContext } from "@/context/WsContext";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

const COLORS = ["red", "blue", "yellow", "green"];
const winPosition = {
  red: "h7",
  blue: "g8",
  green: "i8",
  yellow: "h9",
};

const Board = () => {
  const { data } = useContext(DataContext);
  const { websocket } = useContext(WsContext);
  const { id: gameId } = useParams();
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    // if for a specific color all pieces are at win position, then game is over
    const isGameOver =
      data.pieces.filter(
        (piece) =>
          piece.color === data.color &&
          piece.position === winPosition[data.color]
      ).length === 4;
    if (isGameOver) {
      websocket?.send(JSON.stringify({ type: "game_over", gameId: gameId }));
    }
  }, [data.pieces]);

  const rollDie = () => {
    if (websocket && websocket.readyState === WebSocket.OPEN && !rolling) {
      setRolling(true);
      setTimeout(() => setRolling(false), 1000);
      const rollDieEmitData = {
        type: "roll_die",
        gameId: gameId,
      };
      websocket.send(JSON.stringify(rollDieEmitData));
    }
  };

  const movePiece = (pieceHomeSquare: string) => {
    const movePieceData = {
      type: "make_move",
      gameId: gameId,
      pieceId: pieceHomeSquare,
      dieRoll: data.roll,
    };

    websocket?.send(JSON.stringify(movePieceData));
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="relative w-full max-w-3xl aspect-square bg-white rounded-3xl shadow-2xl p-8">
        {data.players?.map((p, index) => (
          <div
            key={index}
            className={`absolute ${
              index === 0
                ? "top-0 left-[-100px]"
                : index === 1
                ? "top-0 right-[-100px]"
                : index === 2
                ? "bottom-0 right-[-100px]"
                : "bottom-0 left-[-100px]"
            } m-4 ring-2 ring-${COLORS[index]}-400 ring-offset-2`}
          >
            <div
              className={`w-20 h-20 bg-${COLORS[index]}-500 text-white flex justify-center items-center text-2xl font-bold`}
            >
              {p.name}
            </div>
          </div>
        ))}

        {/* Ludo board */}
        <div className="board flex flex-col gap-1 w-full h-full">
          {LUDO_BOARD.map((row, rowIndex) => (
            <div key={rowIndex} className="row flex gap-1 flex-1">
              {row.map((square, idx) => (
                <div
                  key={idx}
                  className={`flex-1 flex items-center justify-center border border-gray-300 ${
                    square.color ? `bg-${square.color}-200` : "bg-gray-50"
                  } ${square.safe ? "ring-2 ring-yellow-400" : ""}`}
                >
                  {square.safe && (
                    <div className="absolute text-yellow-600 text-3xl font-bold">
                      ★
                    </div>
                  )}
                  {data.pieces
                    .filter((piece) => piece.position === square.id)
                    .map((piece, pieceIndex) => (
                      <button
                        key={pieceIndex}
                        className={`piece w-3/4 h-3/4 rounded-full bg-${
                          piece.color
                        }-500 ${
                          data.playMove &&
                          data.turn &&
                          piece.color === data.color
                            ? `ring-2 ring-${data.color}-400 ring-offset-2 cursor-pointer`
                            : ""
                        } transition-all duration-300 ease-in-out transform hover:scale-110`}
                        title={`Piece (${piece.color})`}
                        onClick={() =>
                          data.playMove &&
                          piece.color === data.color &&
                          movePiece(piece.home)
                        }
                      />
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            bg-white rounded-lg shadow-md p-4 transition-all duration-300 
            ${
              rolling
                ? "animate-spin cursor-not-allowed"
                : "hover:shadow-lg cursor-pointer"
            }`}
          onClick={rollDie}
          disabled={rolling || !data.turn}
        >
          {data.roll === 6 && (
            <Dice6
              size={48}
              className={`text-gray-800 ${
                data.turn ? "text-primary" : "text-gray-400"
              }`}
            />
          )}
          {data.roll === 5 && (
            <Dice5
              size={48}
              className={`text-gray-800 ${
                data.turn ? "text-primary" : "text-gray-400"
              }`}
            />
          )}
          {data.roll === 4 && (
            <Dice4
              size={48}
              className={`text-gray-800 ${
                data.turn ? "text-primary" : "text-gray-400"
              }`}
            />
          )}
          {data.roll === 3 && (
            <Dice3
              size={48}
              className={`text-gray-800 ${
                data.turn ? "text-primary" : "text-gray-400"
              }`}
            />
          )}
          {data.roll === 2 && (
            <Dice2
              size={48}
              className={`text-gray-800 ${
                data.turn ? "text-primary" : "text-gray-400"
              }`}
            />
          )}
          {data.roll === 1 && (
            <Dice1
              size={48}
              className={`text-gray-800 ${
                data.turn ? "text-primary" : "text-gray-400"
              }`}
            />
          )}
          {data.roll === 0 && (
            <Dice6
              size={48}
              className={`text-gray-800 ${
                data.turn ? "text-primary" : "text-gray-400"
              }`}
            />
          )}
          
        </button>

        {/* Roll result */}
        {data.roll !== 0 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md">
            {data.name} rolled {data.roll}
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
