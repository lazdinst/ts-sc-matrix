const PROTOCOL = import.meta.env.VITE_REACT_APP_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_REACT_APP_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_REACT_APP_API_PORT || 10000;

let API_URL = `https://${HOST}`;
let WS_URL = `wss://${HOST}`;
if (import.meta.env.VITE_REACT_APP_ENVIRONMENT_DEV) {
  API_URL = `${PROTOCOL}://${HOST}:${PORT}`;
  WS_URL = `ws://${HOST}:${PORT}`;
}
export { API_URL, WS_URL };
