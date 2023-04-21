import { Button } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import ChatDisplaySection from './components/ChatDisplaySection'
import ChatInputBar from './components/ChatInputBar'
import { socket } from './socket'

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
        socket.connect() // TODO this should be removed in prod. In prod this should run after varifying credentials.

        socket.on('connect', () => {
            console.log('connection established to', socket.id)
            socket.on('message', text => {
                console.log('here is the msg:', text)
                setChatMessageList(prev => prev.concat(text))
            })
        })

        if (userId.current.length <= 0) {
            userId.current = crypto.randomUUID()
        }

        setIsLoading(false)
        return () => {
            socket.off('connect')
            socket.off('disconnect')
            socket.disconnect()
        }
    }, [])

    useEffect(() => {}, [chatMessageList])

    const fakeScrollDiv = useRef<HTMLDivElement | null>(null)

    return (
        <>
            {isLoading ? (
                'loading'
            ) : (
                <>
                    <Button
                        onClick={() => {
                            socket.emit('message', 'this is a sample message')
                        }}
                    >
                        emit
                    </Button>
                    <ChatDisplaySection chatMessageList={chatMessageList} fakeScrollDiv={fakeScrollDiv} />
                    <ChatInputBar setChatMessageList={setChatMessageList} fakeScrollDiv={fakeScrollDiv} />
                </>
            )}
        </>
    )
}

export default App
