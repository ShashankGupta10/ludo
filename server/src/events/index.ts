import WebSocket from "ws";
import { joinRoom } from "./joinRoom";
import { startGame } from "./startGame";
import { rollDie } from "./rollDie";
import { makeMove } from "./makeMove";
import { gameOver } from "./gameOver";

const eventHandlers = new Map();

eventHandlers.set("join_room", joinRoom);
eventHandlers.set("start_game", startGame);
eventHandlers.set("roll_die", rollDie);
eventHandlers.set("make_move", makeMove);
eventHandlers.set("game_over", gameOver);

export const handleEvent = (eventType: string, jsonData: any, ws: WebSocket) => {
    const handler = eventHandlers.get(eventType);
    if (handler) {
        handler(jsonData, ws);
    } else {
        console.warn(`Unhandled event type: ${eventType}`);
        ws.send(
            JSON.stringify({
                type: "error",
                message: `Unknown event type: ${eventType}`,
            })
        );
    }
};