import React, { useEffect, useState, useRef } from "react";
import { WsContext } from "./context/WsContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DataContext, DataType } from "./context/DataContext";
// import { Cell } from "./constants/board";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
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
    playMove: false
  });

  useEffect(() => {
    console.log("RE RENDER");
    if (!websocketRef.current) {
      const wsConnection = new WebSocket("ws://localhost:5000");
      websocketRef.current = wsConnection;

      wsConnection.onmessage = (ev) => {
        try {
          const message = JSON.parse(ev.data);
          if (message.type === "players") {
            if (message.success) {
              setData({
                ...data,
                players: message.data,
                isAdmin: message.isAdmin,
              });
            } else {
              toast.error(message.message);
              navigate("/");
            }
          } else if (message.type === "start_game") {
            if (message.success) {
              setData((prevData) => ({ ...prevData, color: message.color }))
              toast.success(message.message);
              navigate(`/board/${message.roomId}`);
            } else toast.error(message.message);
          } else if (message.type === "board_event") {
            setData((prevState) => ({
              ...prevState,
              pieces: message.pieces,
              turn: message.turn,
              playMove: message.playMove
            }));
          } else if (message.type === "roll_die") {
            setData((prevState) => ({
              ...prevState,
              name: message.user,
              roll: message.roll,
            }));
          } else if (message.type === "make_move") {
            setData((prevData) => ({ ...prevData,  }))
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsConnection.onerror = (err) => {
        console.error("WebSocket error:", err);
        toast.error("WebSocket connection failed!");
      };

      wsConnection.onclose = () => {
        console.log("WebSocket connection closed.");
        toast.warn("WebSocket disconnected.");
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
