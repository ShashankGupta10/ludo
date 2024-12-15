/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LUDO_BOARD } from "@/constants/board";
import { DataContext } from "@/context/DataContext";
import { WsContext } from "@/context/WsContext";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const winPosition = {
  red: "h7",
  blue: "g8",
  green: "i8",
  yellow: "h9",
};

const Board = () => {
  const navigate = useNavigate();
  const { data } = useContext(DataContext);
  const { websocket } = useContext(WsContext);
  const { id: gameId } = useParams();
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    if (!data.players) navigate("/")
  }, []);

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

  if (!data.players) return null;
  return (
    <div className="flex h-screen items-center justify-center scale-75 lg:scale-90 xl:scale-100">
      <div className="relative w-full max-w-3xl aspect-square bg-white rounded-3xl shadow-2xl p-4 lg:p-8">
        <div className="absolute flex items-center top-[-75px] left-0 flex-row-reverse md:flex-row md:top-12 md:left-[-100px] transform md:-translate-x-1/2 gap-2">
          <span>{data.players[0].name.length > 5 && window.innerWidth < 768 ? data.players[0].name.slice(0, 5) + "...": data.players[0].name}</span>
          <Avatar>
            <AvatarImage src="https://cdn-icons-png.flaticon.com/512/10412/10412528.png" alt="@shadcn" />
            <AvatarFallback>{data.players[0].name[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute flex items-center gap-2 top-[-75px] right-0 md:top-12 md:right-[-150px] transform -translate-x-1/2x">
          <Avatar>
            <AvatarImage src="https://cdn-icons-png.flaticon.com/512/10412/10412528.png" alt="@shadcn" />
            <AvatarFallback>{data.players[1].name[0]}</AvatarFallback>
          </Avatar>
          <span>{data.players[1].name.length > 5 && window.innerWidth < 768 ? data.players[1].name.slice(0, 5) + "...": data.players[1].name}</span>
        </div>

        {/* Ludo board */}
        <div className="board flex flex-col gap-1 w-full h-full">
          {LUDO_BOARD.map((row, rowIndex) => (
            <div key={rowIndex} className="row flex gap-1 flex-1">
              {row.map((square, idx) => (
                <div
                  key={idx}
                  className={`relative flex-1 flex items-center justify-center rounded-lg border border-gray-300 ${
                    square.color ? `bg-${square.color}-200`: "bg-gray-50"
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
                        className={`piece w-3/4 h-3/4 rounded-full bg-${piece.color}-500 
                        ${
                          data.playMove &&
                          data.turn &&
                          piece.color === data.color
                            ? `ring-2 ring-${data.color}-400 ring-offset-2 cursor-pointer`
                            : ""
                        } transition-all duration-300 ease-in-out transform hover:scale-110`}
                        title={`Piece (${data.color})`}
                        onClick={() =>
                          data.playMove &&
                          piece.color === data.color &&
                          movePiece(piece.home)
                        }
                      ></button>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        {data.players[2] && (
          <div className="absolute flex items-center bottom-[-75px] left-0 flex-row-reverse md:flex-row md:bottom-12 md:left-[-100px] transform md:-translate-x-1/2 gap-2">
            <span>{data.players[2].name.length > 5 && window.innerWidth < 768 ? data.players[2].name.slice(0, 5) + "...": data.players[2].name}</span>
            <Avatar>
              <AvatarImage src="https://cdn-icons-png.flaticon.com/512/10412/10412528.png" alt="@shadcn" />
              <AvatarFallback>{data.players[2].name[0]}</AvatarFallback>
            </Avatar>
          </div>
        )}
        {data.players[3] && (
          <div className="absolute flex items-center gap-2 bottom-[-75px] right-0 md:bottom-12 md:right-[-150px] transform -translate-x-1/2x">
            <Avatar>
              <AvatarImage src="https://cdn-icons-png.flaticon.com/512/10412/10412528.png" alt="@shadcn" />
              <AvatarFallback>{data.players[3]?.name}</AvatarFallback>
            </Avatar>
            <span>{data.players[3].name.length > 5 && window.innerWidth < 768 ? data.players[3].name.slice(0, 5) + "...": data.players[3].name}</span>
          </div>
        )}

        {/* Dice Button */}
        <button
          className={`absolute top-1/2 left-1/2 transform scale-50 md:scale-75 lg:scale-90 xl:scale-100 -translate-x-1/2 -translate-y-1/2 
            bg-white rounded-lg shadow-md p-4 transition-all duration-300 ${data.turn && !data.playMove ? "ring-4 ring-black animate-pulse duration-1000": ""}
            ${
              rolling
                ? "animate-spin cursor-not-allowed"
                : "hover:shadow-lg cursor-pointer"
            }`}
          onClick={rollDie}
          disabled={rolling || !data.turn}
        >
          {data.roll === 6 && <Dice6 size={48} className="text-gray-800" />}
          {data.roll === 5 && <Dice5 size={48} className="text-gray-800" />}
          {data.roll === 4 && <Dice4 size={48} className="text-gray-800" />}
          {data.roll === 3 && <Dice3 size={48} className="text-gray-800" />}
          {data.roll === 2 && <Dice2 size={48} className="text-gray-800" />}
          {data.roll === 1 && <Dice1 size={48} className="text-gray-800" />}
          {data.roll === 0 && <Dice6 size={48} className="text-gray-800" />}
        </button>

        {/* Roll Result */}
        {data.roll !== 0 && (
          <div className="absolute bottom-[-30px] md:bottom-[-10px] left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md">
            {data.name.length > 5 ? data.name.slice(0, 5) + "...": data.name} rolled {data.roll}
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;