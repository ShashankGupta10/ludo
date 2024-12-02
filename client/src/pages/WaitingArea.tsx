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
    const startGameData = {
      type: "start_game",
      gameId: gameId,
    };

    websocket?.send(JSON.stringify(startGameData));
  };

  // Function to send data to the WebSocket
  const sendData = useCallback((ws: WebSocket, dataToSend: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(dataToSend);
      // clearTimeout()
    } else {
      setTimeout(() => sendData(ws, dataToSend), 10); // Retry sending if WebSocket isn't open
      console.log("DONE, WAITING");
    }
  }, []);

  useEffect(() => {
    if (gameId) {
      const joinRoomData = {
        type: "join_room",
        roomId: gameId,
        playerName: data.name
      };

      // Send data when the WebSocket connection opens
      if (websocket) sendData(websocket, JSON.stringify(joinRoomData));

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
      {data.isAdmin && <Button onClick={startGame}>Start Game</Button>}
    </>
  );
};

export default WaitingArea;
