import { Button, Typography } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import ChatDisplaySection from '../components/ChatDisplaySection'
import ChatInputBar from '../components/ChatInputBar'
import TemporaryDrawer from '../components/TemporaryDrawer'
import { CredentialContext } from '../contexts/Credentials'
import { useControlledTextField } from '../hooks/useTextField'
import { socket } from '../socket'
import { PulseLoader } from 'react-spinners'
import { message as MessageFromDB, room as Room } from '../types/prisma.client'

export type Message = Pick<MessageFromDB, 'senderUsername' | 'content' | 'createdAt'>

export const generateDummyMessage = (msg: string, sender?: string): Message => ({
    senderUsername: sender === undefined ? 'undef sender' : sender,
    content: msg,
    createdAt: new Date(),
})

const sampleMsg = [generateDummyMessage('hello world')]

export const Chat = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [chatMessageList, setChatMessageList] = useState<Message[]>(sampleMsg)

    const { username, isLoggedIn } = useContext(CredentialContext)

    const [currRoom, setCurrRoom] = useState<Room>()

    const [rooms, setRooms] = useState<Room[]>([])

    const {
        setError,
        setHelperText,
        ControlledTextField: FriendListTextField,
    } = useControlledTextField(participantName => {
        socket.emit('createNewRoom', participantName, response => {
            if (response === null) {
                setError(false)
                setHelperText('')
            } else {
                setError(true)
                setHelperText(response)
            }
        })
    })

    useEffect(() => {
        if (socket.connected === false && isLoggedIn === true) {
            socket.auth = { username }
            socket.connect() // TODO this should be removed in prod. In prod this should run after varifying credentials.
        }

        setIsLoading(false)

        socket.on('privateMessage', (targetRoomId, messageContents, senderUsername) => {
            const msg = generateDummyMessage(messageContents, senderUsername)
            console.log(msg.senderUsername)
            setChatMessageList(prev => prev.concat(msg))
        })

        socket.on('userRoomsUpdated', rooms => {
            setRooms(rooms)
        })

        socket.on('roomChanged', room => {
            if (room !== undefined) setCurrRoom(room)
        })

        return () => {
            socket.removeAllListeners()
            if (socket.connected === true) {
                socket.disconnect()
            }
        }
    }, [])

    const fakeScrollDiv = useRef<HTMLDivElement | null>(null)

    if (isLoading) return <PulseLoader color='#36d7b7' />

    return (
        <>
            <Typography variant='subtitle1'>{currRoom === undefined ? 'undef' : currRoom.roomDisplayName}</Typography>
            <Button onClick={() => console.log(chatMessageList)} />

            <TemporaryDrawer
                listItems={rooms.map(({ roomDisplayName }) => roomDisplayName)}
                handleClickOnList={roomDisplayName => {
                    const roomId = rooms.find(room => room.roomDisplayName === roomDisplayName)?.roomId
                    if (roomId !== undefined) socket.emit('roomSelected', roomId)
                }}
                handleClickOnListIcon={clickedUsername => {}}
            >
                {FriendListTextField({ placeholder: "Enter Friend's username" })}
            </TemporaryDrawer>

            <ChatDisplaySection chatMessageList={chatMessageList} fakeScrollDiv={fakeScrollDiv} />

            <ChatInputBar setChatMessageList={setChatMessageList} currRoom={currRoom?.roomId} />
        </>
    )
}
