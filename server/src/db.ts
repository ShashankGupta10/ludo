import { Piece } from "./constants/board"
import WebSocket from "ws"
enum Color {
    red = "red",
    blue = "blue",
    green = "green",
    yellow = "yellow"
}

type UserData = {
    ws: WebSocket,
    admin: boolean,
    turn: boolean
    name: string,
    color: Color
    isOnline: boolean
}

export type GameData = {
    users: Array<UserData>,
    pieces: Array<Piece>
    isStarted: boolean
}

export const games: Record<string, GameData | null> = {};