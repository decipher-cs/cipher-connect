import { io } from 'socket.io-client'

const URL = import.meta.env.PROD ? window.location.origin : import.meta.env 'http://localhost:3000'

export const socket = io(URL, { autoConnect: false })
