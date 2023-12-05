import { useContext } from 'react'
import { SocketContext } from '../contexts/Socket'

export const useSocket = () => {
    const socket = useContext(SocketContext)

    if (socket === null) throw new Error('Socket.io  cannot be used outside context')

    return socket
}
