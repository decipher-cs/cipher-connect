import { io, Socket } from 'socket.io-client'
import { Message } from './pages/Chat'

interface ServerToClientEvents {
    noArg: () => void
    withAck: (d: string, callback: (e: number) => void) => void
    updateNetworkList: (users: string[]) => void
    privateMessage: (target: string, msg: Message) => void
}

// for socket.on()
interface ClientToServerEvents {
    privateMessage: (target: string, msg: Message) => void
    updateNetworkList: (users: string[]) => void
    addUserToNetwork: (newConnectionName: string) => void // might wanna use acknowledgment here
}

const URL = import.meta.env.PROD ? window.location.origin : import.meta.env.VITE_SERVER_DEV_URL

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, { autoConnect: false })
