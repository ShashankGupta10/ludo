import { createContext, Dispatch, SetStateAction } from "react";

export type DataType = {
  players: string[] | null;
  isAdmin: boolean
  name: string
};
type DataContext = {
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
};

export const DataContext = createContext<DataContext>({
  data: { players: null, isAdmin: false, name: "" },
  setData: () => {},
});
