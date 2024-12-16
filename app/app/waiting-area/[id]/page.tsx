import React, { useEffect, useContext, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { WsContext } from "@/context/WsContext";
import { DataContext } from "@/context/DataContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Play, User, UserPlus } from "lucide-react-native";

const WaitingArea = () => {
  const { websocket } = useContext(WsContext);
  const { data } = useContext(DataContext);
  const { id: gameId } = useLocalSearchParams<{ id: string }>();
  console.log(gameId);
  const playerColors = ["text-red-500", "text-blue-500", "text-green-500", "text-yellow-500"];

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

  const startGame = () => {
    const startGameData = {
      type: "start_game",
      gameId,
    };
    websocket?.send(JSON.stringify(startGameData));
  };

  const sendData = useCallback((ws: WebSocket, dataToSend: string) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(dataToSend);
    else setTimeout(() => sendData(ws, dataToSend), 10);
  }, []);

  useEffect(() => {
    if (gameId) {
      const joinRoomData = {
        type: "join_room",
        roomId: gameId,
        playerName: data.name,
      };

      if (websocket) sendData(websocket, JSON.stringify(joinRoomData));
    }
  }, [gameId, sendData, websocket]);

  const players = data.players || [];

  return (
    <View className="flex-1 bg-yellow-500 items-center justify-center p-4">
      <View className="w-full max-w-md bg-white/90 rounded-lg shadow-lg p-6">
        <Text className="text-4xl font-bold text-center mb-6 text-indigo-600">Ludo Lounge</Text>
        <View className="flex-row justify-center mb-6">
          {diceIcons.map((DiceIcon, index) => (
            <DiceIcon key={index} className="w-8 h-8 mx-1 text-blue-500" />
          ))}
        </View>
        <FlatList
          data={players}
          keyExtractor={(item, index) => `player-${index}`}
          renderItem={({ item, index }) => (
            <View className="flex-row items-center justify-between p-2 bg-purple-100 rounded mb-2">
              <Text className={`font-medium ${playerColors[index]}`}>{item.name}</Text>
              <User className={`${playerColors[index]}`} />
            </View>
          )}
          ListEmptyComponent={() => (
            <>
              {Array(4 - players.length)
                .fill(null)
                .map((_, index) => (
                  <View
                    key={`empty-${index}`}
                    className="flex-row items-center justify-center p-2 border border-dashed border-gray-300 rounded mb-2"
                  >
                    <UserPlus className="mr-2 text-gray-400" />
                    <Text className="text-gray-400 italic">Waiting for player...</Text>
                  </View>
                ))}
            </>
          )}
        />
        {data.isAdmin && (
          <TouchableOpacity
            onPress={startGame}
            disabled={players.length < 2 || players.length > 4}
            className={`mt-6 w-full py-3 rounded-full ${
              players.length < 2 || players.length > 4
                ? "bg-gray-300 text-gray-500"
                : "bg-yellow-400 text-purple-700 hover:bg-yellow-500 hover:text-purple-800"
            }`}
          >
            <View className="flex-row justify-center items-center">
              <Play className="mr-2" />
              <Text className="text-xl font-bold">
                {players.length < 2 ? "Waiting for Players..." : "Let's Roll!"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default WaitingArea;
