// src/socket.js
import { io } from 'socket.io-client';

// Make sure this points to your PRODUCTION backend, not localhost!
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 3000
});

export default socket;
