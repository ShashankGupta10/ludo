import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataContext } from "@/context/DataContext";
import { WsContext } from "@/context/WsContext";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Play, User, UserPlus } from "lucide-react";
import { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

const WaitingArea = () => {
  const { websocket } = useContext(WsContext);
  const { data } = useContext(DataContext);
  const { id: gameId } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const playerColors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
  ];

  const diceIcons = [
    Dice1,
    Dice2,
    Dice3,
    Dice4,
    Dice5,
    Dice6,
  ];

  const startGame = () => {
    const startGameData = {
      type: "start_game",
      gameId: gameId,
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
    <div className="min-h-screen bg-yellow-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">
            Ludo Lounge
          </h1>
          <div className="flex justify-center mb-6">
            {diceIcons.map((DiceIcon, index) => (
              <DiceIcon key={index} className="w-8 h-8 mx-1 text-blue-500" />
            ))}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-bold text-lg text-purple-600">
                  Joined Players
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-purple-100 transition-colors"
                >
                  <TableCell className="flex items-center justify-between">
                    <span className={`font-medium ${playerColors[index]}`}>
                      {player.name}
                    </span>
                    <User className={`${playerColors[index]}`} />
                  </TableCell>
                </TableRow>
              ))}
              {Array(4 - players.length)
                .fill(null)
                .map((_, index) => (
                  <TableRow key={`empty-${index}`}>
                    <TableCell className="text-center text-gray-400 italic">
                      <span className="flex items-center justify-center">
                        <UserPlus className="mr-2" />
                        Waiting for player...
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {data.isAdmin && (
            <div className="mt-6">
              <Button
                onClick={startGame}
                disabled={players.length < 2 && players.length < 4}
                className={`w-full text-xl font-bold py-3 rounded-full transition-all duration-200 ${
                  players.length < 2 && players.length < 4
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500 text-purple-700 hover:text-purple-800 transform hover:scale-105"
                }`}
              >
                <Play className="mr-2" />
                {players.length > 2 && players.length < 4 ? "Waiting for Players..." : "Let's Roll!"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingArea;
