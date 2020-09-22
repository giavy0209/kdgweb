import io from 'socket.io-client/dist/socket.io';
const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000
  };
const socket = io('https://ws.kingdomgame.org',connectionConfig);

export default socket