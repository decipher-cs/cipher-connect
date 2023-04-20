import { Button, createTheme, Paper, Stack, ThemeProvider } from '@mui/material'
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import './App.css'
import ChatDisplaySection from './components/ChatDisplaySection'
import ChatInputBar from './components/ChatInputBar'

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

const socket = io('http://localhost:3000')

const sampleMessage = [generateDummyMessage(), generateDummyMessage(), generateDummyMessage()]

function App() {
    const [isLoading, setIsLoading] = useState(true)
    const userId = useRef('')
    const [chatMessageList, setChatMessageList] = useState<MessageList>(sampleMessage)

    useEffect(() => {
        // socket.on('some-event', ()=>{console.log('event happened... i think.')})
        socket.on('connect', () => {
            console.log('connection established to', socket.id)
            socket.emit('msg', 'this is a sample message')
        })

        if (userId.current.length <= 0) {
            userId.current = crypto.randomUUID()
        }

        setIsLoading(false)
    }, [])

    return (
        <>
            {isLoading ? (
                'loading'
            ) : (
                <>
                    <Button
                        onClick={() => {
                            socket.emit('chat message', 'this is a sample message')
                        }}
                    >
                        emit
                    </Button>
                    <ChatDisplaySection chatMessageList={chatMessageList} />
                    <ChatInputBar setChatMessageList={setChatMessageList} />
                </>
            )}
        </>
    )
}

export default App
