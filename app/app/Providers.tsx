import React, { useEffect, useState, useRef } from "react";
import { WsContext } from "@/context/WsContext";
import { RelativePathString, useRouter } from "expo-router";
import { DataContext, DataType } from "@/context/DataContext";
import Toast from "react-native-toast-message";
import { WEBSOCKET_SERVER_URL } from "@/config";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const websocketRef = useRef<WebSocket | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [data, setData] = useState<DataType>({
    players: null,
    isAdmin: false,
    name: "",
    pieces: [],
    turn: false,
    roll: 0,
    color: "",
    playMove: false,
  });

  useEffect(() => {
    if (!websocketRef.current) {
        console.log(WEBSOCKET_SERVER_URL);
      const wsConnection = new WebSocket(WEBSOCKET_SERVER_URL);
      websocketRef.current = wsConnection;

      wsConnection.onmessage = (ev) => {
        try {
          const message = JSON.parse(ev.data);
          console.log(message);
          if (message.type === "players") {
            if (message.success) {
              setData((prevData) => ({
                ...prevData,
                players: message.data,
                isAdmin: message.isAdmin,
              }));
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: message.message,
              });
              router.push("/index" as RelativePathString);
            }
          } else if (message.type === "start_game") {
            if (message.success) {
              setData((prevData) => ({ ...prevData, color: message.color }));
              Toast.show({
                type: 'success',
                text1: 'Game Started',
                text2: message.message,
              });
              router.push(`/board/${message.roomId}/page` as RelativePathString);
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: message.message,
              });
            }
          } else if (message.type === "board_event") {
            setData((prevState) => ({
              ...prevState,
              pieces: message.pieces,
              turn: message.turn,
              playMove: message.playMove,
            }));
          } else if (message.type === "roll_die") {
            setData((prevState) => ({
              ...prevState,
              name: message.user,
              roll: message.roll,
            }));
          } else if (message.type === "make_move") {
            setData((prevData) => ({ ...prevData }));
          } else if (message.type === "game_over") {
            Toast.show({
              type: 'success',
              text1: 'Game Over',
              text2: message.message,
            });
            setTimeout(() => {
              router.push("/index" as RelativePathString);
            }, 3000);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsConnection.onerror = (err) => {
        console.error("WebSocket error:", err);
        Toast.show({
          type: 'error',
          text1: 'WebSocket Error',
          text2: 'WebSocket connection failed!',
        });
      };

      wsConnection.onclose = () => {
        console.log("WebSocket connection closed.");
        Toast.show({
          type: 'warning',
          text1: 'WebSocket Disconnected',
          text2: 'The WebSocket connection was closed.',
        });
        websocketRef.current = null;
      };

      setWebsocket(wsConnection);
    }
  }, []);

  return (
    <WsContext.Provider value={{ websocket, setWebsocket }}>
      <DataContext.Provider value={{ data, setData }}>
        {children}
      </DataContext.Provider>
    </WsContext.Provider>
  );
};

export default Providers;
