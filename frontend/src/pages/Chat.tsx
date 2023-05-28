import { Button, TextField, textFieldClasses, Typography } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import ChatDisplaySection from '../components/ChatDisplaySection'
import ChatInputBar from '../components/ChatInputBar'
import TemporaryDrawer from '../components/TemporaryDrawer'
import { CredentialContext } from '../contexts/Credentials'
import { useControlledTextField } from '../hooks/useTextField'
import { socket } from '../socket'

export interface Message {
    uuid: string
    sender: string
    time: Date
    text: string
}

export type MessageList = Message[]

const generateDummyMessage = (msg?: string): Message => ({
    uuid: crypto.randomUUID(),
    sender: 'anon',
    time: new Date(),
    text: msg === undefined ? 'sample' : msg,
})

const sampleMsg = [generateDummyMessage()]

export const Chat = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [userId, setUserId] = useState('')

    const [chatMessageList, setChatMessageList] = useState<MessageList>(sampleMsg)

    const [network, setNetwork] = useState<string[]>([])

    const [recipient, setRecipient] = useState<string>()

    const { username, isLoggedIn } = useContext(CredentialContext)

    const { value, ControlledTextField: FiendListTextField } = useControlledTextField(() => {
        console.log('submit')
    })

    useEffect(() => {
        if (socket.connected === false && isLoggedIn === true) {
            socket.auth = { username }
            socket.connect() // TODO this should be removed in prod. In prod this should run after varifying credentials.
        }

        socket.on('connect', () => {
            console.log('connection established to', socket.id)
            setUserId(socket.id)
        })

        // socket.on('session', ()=>{
        //
        // })

        socket.on('privateMessage', (from, msg) => {
            console.log(from, 'said', msg)
            setChatMessageList(prev => prev.concat(msg))
        })

        socket.on('updateNetworkList', (users: string[]) => {
            if (users !== undefined) {
                // const userListWithoutSelf = users.filter(user => user !== username) // Actually the user should be able to msg self
                setNetwork(users)
            }
        })

        setIsLoading(false)
        return () => {
            socket.removeAllListeners()
            if (socket.connected === true) {
                console.log('disabling socket')
                socket.disconnect()
            }
        }
    }, [])

    useEffect(() => {}, [chatMessageList])

    const fakeScrollDiv = useRef<HTMLDivElement | null>(null)
    return (
        <>
            <Typography variant='subtitle1'>Userid is: {userId} </Typography>

            <Typography variant='subtitle1'>Recipient: {recipient === undefined ? 'none' : recipient} </Typography>

            <TemporaryDrawer network={network} handleRoomOnClick={room => setRecipient(room)}>
                {FiendListTextField({ placeholder: "Enter Friend's username" })}
            </TemporaryDrawer>

            <ChatDisplaySection chatMessageList={chatMessageList} fakeScrollDiv={fakeScrollDiv} />

            <ChatInputBar setChatMessageList={setChatMessageList} recipient={recipient} />
        </>
    )
}
