import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
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
            console.log('socket connection successful')
        })
        socket.on('connect_error', err => {
            console.log('error while connecting through socket. ->', err)
        })
        socket.on('disconnect', (reason, description) => {
            console.log('socket disconnected.\n', 'reason:', reason, 'description:', description)
        })

        return () => {
            socket.removeAllListeners()
            socket.disconnect()
        }
    }, [socket])

    return <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
}
