import { createContext, Dispatch, SetStateAction } from "react";

type WsContextType = {
  websocket: WebSocket | null;
  setWebsocket: Dispatch<SetStateAction<WebSocket | null>>;
};

export const WsContext = createContext<WsContextType>({
  websocket: null,
  setWebsocket: () => {},
});
