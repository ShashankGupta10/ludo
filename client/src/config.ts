export const WEBSOCKET_SERVER_URL = process.env.NODE_ENV === "production" ? "wss://ludo-nh15.onrender.com": "ws://localhost:5000"
export const HTTP_SERVER_URL = process.env.NODE_ENV === "production" ? "https://ludo-nh15.onrender.com": "http://localhost:5000"