import { Button, Drawer, Paper } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import ChatDisplaySection from '../components/ChatDisplaySection'
import ChatInputBar from '../components/ChatInputBar'
import TemporaryDrawer from '../components/TemporaryDrawer'
import { socket } from '../socket'

export interface Message {
    uuid: string
    sender: string
    time: Date
    text: string
}

export type MessageList = Message[]

const generateDummyMessage = (): Message => ({
    uuid: crypto.randomUUID(),
    sender: 'anon',
    time: new Date(),
    text: 'sample',
})

const sampleMsg = [generateDummyMessage()]

export const Chat = () => {
    const [isLoading, setIsLoading] = useState(true)
    const userId = useRef('')
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false)
    const [chatMessageList, setChatMessageList] = useState<MessageList>(sampleMsg)

    useEffect(() => {
        // socket.connect() // TODO this should be removed in prod. In prod this should run after varifying credentials.

        socket.on('connect', () => {
            console.log('connection established to', socket.id)
        })

        socket.on('message', text => {
            setChatMessageList(prev => prev.concat(text))
        })

        if (userId.current.length <= 0) {
            userId.current = crypto.randomUUID()
        }

        setIsLoading(false)
        return () => {
            // socket.off('connect')
            // socket.off('disconnect')
            // socket.disconnect()
        }
    }, [])

    useEffect(() => {}, [chatMessageList])

    const fakeScrollDiv = useRef<HTMLDivElement | null>(null)
    return (
        <>
            <TemporaryDrawer />
            <ChatDisplaySection chatMessageList={chatMessageList} fakeScrollDiv={fakeScrollDiv} />
            <ChatInputBar setChatMessageList={setChatMessageList} />
        </>
    )
}
