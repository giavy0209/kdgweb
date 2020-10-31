import io from 'socket.io-client'

const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000
};

const socket = io('https://kdg-api.kingdomgame.co',connectionConfig)

export default socket