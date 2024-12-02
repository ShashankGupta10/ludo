import React, { useEffect, useState, useRef } from "react";
import { WsContext } from "./context/WsContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DataContext, DataType } from "./context/DataContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const { id: gameId } = useParams()
  const navigate = useNavigate();
  const websocketRef = useRef<WebSocket | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [data, setData] = useState<DataType>({ players: null, isAdmin: false, name: "" });

  useEffect(() => {
    if (!websocketRef.current) {    
      const wsConnection = new WebSocket("ws://localhost:5000");
      websocketRef.current = wsConnection;

      wsConnection.onmessage = (ev) => {
        try {
          const message = JSON.parse(ev.data);
          console.log(message);
          if (message.type === "players") {
            if (message.success) {
              console.log("SETTING DATA TO ", message.data);
              setData({ ...data, players: message.data, isAdmin: message.isAdmin });
            } else {
              toast.error(message.message);
              navigate("/");
            }
          } else if (message.type === "start_game") {
            if (message.success) {
              toast.success(message.message);
              navigate(`/board/${message.roomId}`);
            } else toast.error(message.message);
          } else if (message.type === "board_data") {
            console.log(message);
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
  }, [data, navigate, gameId]);

  return (
    <WsContext.Provider value={{ websocket, setWebsocket }}>
      <DataContext.Provider value={{ data, setData }}>
        {children}
      </DataContext.Provider>
    </WsContext.Provider>
  );
};

export default Providers;
