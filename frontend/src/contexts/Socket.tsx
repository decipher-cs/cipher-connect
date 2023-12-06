import { createContext, PropsWithChildren, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { socket } from '../socket'

export const SocketContext = createContext<null | typeof socket>(null)

export const SocketContextProvider = (props: PropsWithChildren) => {
    const {
        authStatus: { username },
    } = useAuth()

    useEffect(() => {
        if (socket.connected) socket.disconnect()

        socket.auth = { username }
        socket.connect()

        socket.on('connect', () => {
            import.meta.env.DEV ?? console.log('socket connection successful')
        })
        socket.on('connect_error', err => {
            import.meta.env.DEV ?? console.log('error while connecting through socket. ->', err)
        })
        socket.on('disconnect', (reason, description) => {
            import.meta.env.DEV ?? console.log('socket disconnected.\n', 'reason:', reason, 'description:', description)
        })

        return () => {
            socket.removeAllListeners()
            socket.disconnect()
        }
    }, [socket])

    return <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
}
