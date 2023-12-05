import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from './types/socket'

const URL = import.meta.env.VITE_SOCKET_URL

if (!URL) throw new Error('Environment variable for socket URL not provided to app. Check server config.')

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, { autoConnect: false })
