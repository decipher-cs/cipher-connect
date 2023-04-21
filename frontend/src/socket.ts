import { io } from 'socket.io-client'

const URL = import.meta.env.PROD ? undefined : 'http://localhost:3000'
console.log(import.meta.env.PROD)

export const socket = io(URL, { autoConnect: false })
