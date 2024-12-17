import React, { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, Animated, Easing, Dimensions } from "react-native";
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router";
import { DataContext } from "@/context/DataContext";
import { WsContext } from "@/context/WsContext";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react-native";
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
  const { width } = Dimensions.get("window")
  const diceSize = width * 0.08;
  console.log(Math.floor(diceSize));
  const { data } = useContext(DataContext);
  const { websocket } = useContext(WsContext);
  const [rolling, setRolling] = useState(false);
  const pulseAnimation = new Animated.Value(1);

  const getColor = (
    color: "red" | "green" | "blue" | "yellow",
    shade: 200 | 500
  ): string => {
    const colors: Record<
      "red" | "green" | "blue" | "yellow",
      { 200: string; 500: string }
    > = {
      red: {
        200: "#fc8181", // Light red
        500: "#f56565", // Base red
      },
      green: {
        200: "#9ae6b4", // Light green
        500: "#48bb78", // Base green
      },
      blue: {
        200: "#90cdf4", // Light blue
        500: "#4299e1", // Base blue
      },
      yellow: {
        200: "#faf089", // Light yellow
        500: "#ecc94b", // Base yellow
      },
    };
  
    return colors[color]?.[shade] || "#e2e8f0"; // Default to gray-300
  };

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
      websocket.send(JSON.stringify({ type: "roll_die", gameId }));
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

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    console.log(data);
    if (data.turn && data.playMove) startPulse();
  }, [data.turn, data.playMove]);

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
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 2,
                    padding: 2,
                    borderRadius: 8,
                    backgroundColor: square.color
                      ? getColor(square.color, 200)
                      : "#E5E7EB", // Default gray-100
                    borderWidth: square.safe ? 2 : 0,
                    borderColor: square.safe ? "#ecc94b" : "#f7fafc",
                  }}
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
                        style={{
                          width: "75%",
                          height: "75%",
                          borderRadius: 50,
                          backgroundColor: getColor(piece.color, 500),
                          borderWidth:
                            data.playMove &&
                            data.turn &&
                            piece.color === data.color
                              ? 2
                              : 0,
                          borderColor: getColor(
                            data.color as "red" | "blue" | "green" | "yellow",
                            200
                          ),
                        }}
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
        <Animated.View
          style={{
            transform: [{ scale: pulseAnimation }, { translateX: "-50%" }, { translateY: "-50%" }],
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        >
          <Pressable
            style={{
              backgroundColor: "white",
              padding: 8,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={rollDie}
            disabled={rolling || !data.turn}
          >
            {rolling ? (
              <Text className="text-xl font-bold text-gray-600">...</Text>
            ) : (
              <>
                {data.roll === 6 && <Dice6 size={Math.floor(diceSize)} />}
                {data.roll === 5 && <Dice5 size={Math.floor(diceSize)} />}
                {data.roll === 4 && <Dice4 size={Math.floor(diceSize)} />}
                {data.roll === 3 && <Dice3 size={Math.floor(diceSize)} />}
                {data.roll === 2 && <Dice2 size={Math.floor(diceSize)} />}
                {data.roll === 1 && <Dice1 size={Math.floor(diceSize)} />}
                {data.roll === 0 && <Dice1 size={Math.floor(diceSize)} />}
              </>
            )}
          </Pressable>
        </Animated.View>

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
