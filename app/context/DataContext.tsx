import { Piece } from "@/constants/board";
import { createContext, Dispatch, SetStateAction } from "react";

type Player = {
  name: string;
  isOnline: boolean;
}

export type DataType = {
  players: Player[] | null;
  isAdmin: boolean
  name: string
  pieces: Array<Piece>
  turn: boolean
  roll: number
  color: string
  playMove: boolean
};

type DataContext = {
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
};

export const DataContext = createContext<DataContext>({
  data: { players: null, isAdmin: false, name: "", pieces: [], turn: false, roll: 0, color: "", playMove: false },
  setData: () => {},
});
