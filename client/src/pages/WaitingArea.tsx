import { Button } from "@/components/ui/button";
import { DataContext } from "@/context/DataContext";
import { WsContext } from "@/context/WsContext";
import { useCallback, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const WaitingArea = () => {
  const { websocket, setWebsocket } = useContext(WsContext);
  const { data } = useContext(DataContext)
  const { id: gameId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const startGame = () => {
    const data = {
      type: "start_game",
      gameId: gameId,
    };

    websocket?.send(JSON.stringify(data));
  };

  // Function to send data to the WebSocket
  const sendData = useCallback((ws: WebSocket, data: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    } else {
      setTimeout(() => sendData(ws, data), 10); // Retry sending if WebSocket isn't open
    }
  }, []);

  useEffect(() => {
    if (gameId) {
      const data = {
        type: "join_room",
        roomId: gameId,
      };

      // Send data when the WebSocket connection opens
      if (websocket) sendData(websocket, JSON.stringify(data));

      // return () => {
      //   websocket?.close();
      // };
    }
  }, [gameId, setWebsocket, sendData, navigate, websocket]);

  return (
    <>
      <div>WaitingArea</div>
      <p>Players:</p>
      <ul>
        {data.players?.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <Button onClick={startGame}>Start Game</Button>
    </>
  );
};

export default WaitingArea;
