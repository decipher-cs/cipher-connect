import { createTheme, Paper, Stack, ThemeProvider } from '@mui/material'
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
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

const sampleMessage = [generateDummyMessage(), generateDummyMessage(), generateDummyMessage()]

function App() {
    const [isLoading, setIsLoading] = useState(true)
    const userId = useRef('')
    const [chatMessageList, setChatMessageList] = useState<MessageList>(sampleMessage)

    useEffect(() => {
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
                    <ChatDisplaySection chatMessageList={chatMessageList} />
                    <ChatInputBar setChatMessageList={setChatMessageList} />
                </>
            )}
        </>
    )
}

export default App
