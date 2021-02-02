import io from 'socket.io-client'
import { storage } from './helpers'
import {refreshToken} from './axios'
import { WS_DOMAIN } from './constant'
const socket = io(WS_DOMAIN)
socket.on('connect' , async () => {
    const token = await storage.getToken()
    socket.emit('auth' , token)
    console.log('socket connected');
})
socket.on('authed' , () => {
    console.log('authed');
})
socket.on('not-auth' ,async () => {
    const {status} = await refreshToken()
    if(status === 0) socket.disconnect()
    const token = await storage.getToken()
    socket.emit('auth' , token)
})

socket.on('disconnect' , () => {
    console.log('disconnect');
})
export default socket