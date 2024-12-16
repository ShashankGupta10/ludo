import React, { useContext, useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router";
import { DataContext } from "@/context/DataContext";
import { WsContext } from "@/context/WsContext";
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
} from "lucide-react-native";
import { LUDO_BOARD } from "@/constants/board";

const winPosition = {
  red: "h7",
  blue: "g8",
  green: "i8",
  yellow: "h9",
};

const Board = () => {
  const router = useRouter();
  const { id: gameId } = useLocalSearchParams<{ id: string }>();
  const { data } = useContext(DataContext);
  const { websocket } = useContext(WsContext);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const isGameOver =
      data.pieces.filter(
        (piece) =>
          piece.color === data.color &&
          piece.position === winPosition[data.color]
      ).length === 4;
    if (isGameOver) {
      websocket?.send(JSON.stringify({ type: "game_over", gameId }));
    }
  }, [data.pieces]);

  useEffect(() => {
    if (!data.players) router.push("index" as RelativePathString);
  }, [data.players]);

  const rollDie = () => {
    if (websocket && websocket.readyState === WebSocket.OPEN && !rolling) {
      setRolling(true);
      setTimeout(() => setRolling(false), 1000);
      websocket.send(
        JSON.stringify({ type: "roll_die", gameId })
      );
    }
  };

  const movePiece = (pieceHomeSquare: string) => {
    websocket?.send(
      JSON.stringify({
        type: "make_move",
        gameId,
        pieceId: pieceHomeSquare,
        dieRoll: data.roll,
      })
    );
  };

  if (!data.players) return null;

  return (
    <View className="flex items-center justify-center h-screen">
      <View className="relative w-11/12 aspect-square bg-white rounded-3xl shadow-2xl p-4 border-2 border-gray-300">
        <View className="board flex flex-col w-full h-full">
          {LUDO_BOARD.map((row, rowIndex) => (
            <View key={rowIndex} className="flex flex-row flex-1">
              {row.map((square, idx) => (
                <View
                  key={idx}
                  className={`relative flex-1 flex items-center justify-center m-0.5 p-0.5 rounded-lg ${
                    square.color ? `bg-${square.color}-400` : "bg-gray-100"
                  } ${square.safe ? "border-2 border-yellow-500" : ""}`}
                >
                  {square.safe && (
                    <Text className="absolute flex justify-center items-center text-yellow-600 font-bold">
                      ★
                    </Text>
                  )}
                  {data.pieces
                    .filter((piece) => piece.position === square.id)
                    .map((piece, pieceIndex) => (
                      <Pressable
                        key={pieceIndex}
                        className={`w-3/4 h-3/4 rounded-full bg-${piece.color}-700 ${
                          data.playMove &&
                          data.turn &&
                          piece.color === data.color
                            ? `ring-2 ring-${data.color}-400`
                            : ""
                        }`}
                        onPress={() =>
                          data.playMove &&
                          piece.color === data.color &&
                          movePiece(piece.home)
                        }
                      />
                    ))}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Dice Roll Button */}
        <Pressable
          className="absolute top-1/2 left-1/2 transform bg-white p-4 rounded-full border border-gray-300 shadow-lg"
          onPress={rollDie}
          disabled={rolling || !data.turn}
        >
          {rolling ? (
            <Text className="text-xl font-bold text-gray-600">Rolling...</Text>
          ) : (
            <>
              {data.roll === 6 && <Dice6 size={48} />}
              {data.roll === 5 && <Dice5 size={48} />}
              {data.roll === 4 && <Dice4 size={48} />}
              {data.roll === 3 && <Dice3 size={48} />}
              {data.roll === 2 && <Dice2 size={48} />}
              {data.roll === 1 && <Dice1 size={48} />}
            </>
          )}
        </Pressable>

        {/* Roll Result */}
        {data.roll !== 0 && (
          <View className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md border">
            <Text>{`${data.name} rolled ${data.roll}`}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Board;
