import React, { createContext, PropsWithChildren, useContext, useState } from 'react'
import { socket } from '../socket'

export const SocketContext = createContext(socket)

export const SocketContextProvider = (props: PropsWithChildren) => {
    return (
        <>
            <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
        </>
    )
}
