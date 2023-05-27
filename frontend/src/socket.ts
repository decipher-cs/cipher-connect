import { io, Socket } from 'socket.io-client'

interface ServerToClientEvents {
    noArg: () => void
    withAck: (d: string, callback: (e: number) => void) => void
    updateUserList: (users: string[]) => void
    privateMessage: (target: string, msg: string) => void
}

// for socket.on()
interface ClientToServerEvents {
    privateMessage: (target: string, msg: string) => void
    updateUserList: (users: string[]) => void
}


const URL = import.meta.env.PROD ? window.location.origin : import.meta.env.VITE_SERVER_DEV_URL

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, { autoConnect: false })
