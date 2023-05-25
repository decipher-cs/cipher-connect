import { Button, Drawer, Paper, TextField, Typography } from '@mui/material'
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
    const [userId, setUserId] = useState('')
    const [chatMessageList, setChatMessageList] = useState<MessageList>(sampleMsg)
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])
    const [recipient, setRecipient] = useState<string>()

    useEffect(() => {
        socket.connect() // TODO this should be removed in prod. In prod this should run after varifying credentials.

        socket.on('connect', () => {
            console.log('connection established to', socket.id)
            setUserId(socket.id)
        })

        socket.on('message', (from, text) => {
            console.log(from, 'said', text)
            setChatMessageList(prev => prev.concat(text))
        })

        socket.on('users', (users: string[]) => {
            if (users !== undefined) setOnlineUsers(users)
        })

        setIsLoading(false)
        return () => {
            socket.removeAllListeners()
            socket.disconnect()
        }
    }, [])

    useEffect(() => {}, [chatMessageList])

    const fakeScrollDiv = useRef<HTMLDivElement | null>(null)
    return (
        <>
            <Typography variant='subtitle1'>Userid is: {userId} </Typography>
            <Typography variant='subtitle1'>Recipient: {recipient === undefined ? 'none' : recipient} </Typography>
            <TemporaryDrawer availableRooms={onlineUsers} handleRoomOnClick={room => setRecipient(room)} />
            <ChatDisplaySection chatMessageList={chatMessageList} fakeScrollDiv={fakeScrollDiv} />
            <ChatInputBar setChatMessageList={setChatMessageList} recipient={recipient} />
        </>
    )
}
