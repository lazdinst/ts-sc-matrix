const PROTOCOL = import.meta.env.VITE_REACT_APP_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_REACT_APP_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_REACT_APP_API_PORT || 10000;

export const API_URL = `${PROTOCOL}://${HOST}:${PORT}`;
