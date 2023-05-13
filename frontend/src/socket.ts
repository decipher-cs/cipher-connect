import { io } from 'socket.io-client'

const URL = import.meta.env.PROD ? window.location.origin : import.meta.env.VITE_SERVER_DEV_URL

console.log('socket on', URL)

export const socket = io(URL, { autoConnect: true })
