import { useContext } from 'react'
import { SocketContext } from '../contexts/Socket'

export const useSocket = () => {
    const socket = useContext(SocketContext)
    return socket
}
