import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from './types/socket'

const URL = import.meta.env.VITE_SERVER_URL

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, { autoConnect: false })
