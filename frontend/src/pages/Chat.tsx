import { Button, Dialog, TextField, Typography } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import ChatDisplaySection from '../components/ChatDisplaySection'
import ChatInputBar from '../components/ChatInputBar'
import Sidebar from '../components/Sidebar'
import { CredentialContext } from '../contexts/Credentials'
import { socket } from '../socket'
import { PulseLoader } from 'react-spinners'
import { message as MessageFromDB, room as Room } from '../types/prisma.client'
import AddRoom from '../components/AddRoom'
import { MessageSidebar } from '../components/MessageSidebar'
import { RoomInfo } from '../components/RoomInfo'
import { RoomWithParticipants } from '../types/socket'

export type Message = Pick<MessageFromDB, 'senderUsername' | 'content' | 'createdAt' | 'roomId'>

export const generateDummyMessage = (msg: string, sender?: string, roomId?: string): Message => ({
    senderUsername: sender === undefined ? 'undef sender' : sender,
    roomId: roomId === undefined ? 'undef sender' : roomId,
    content: msg,
    createdAt: new Date(),
})

export const Chat = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [chatMessageList, setChatMessageList] = useState<Message[]>([])

    const { username, isLoggedIn } = useContext(CredentialContext)

    const [currRoom, setCurrRoom] = useState<RoomWithParticipants>()

    const [rooms, setRooms] = useState<RoomWithParticipants[]>([])

    useEffect(() => {
        if (socket.connected === false && isLoggedIn === true) {
            socket.auth = { username }
            socket.connect() // TODO this should be removed in prod. In prod this should run after varifying credentials.
        }

        setIsLoading(false)

        socket.on('privateMessage', (targetRoomId, messageContents, senderUsername) => {
            const msg = generateDummyMessage(messageContents, senderUsername)
            setChatMessageList(prev => prev.concat(msg))
            if (targetRoomId === undefined || targetRoomId !== currRoom?.roomId) {
                // TODO send notification for a new message
            }
        })

        socket.on('userRoomsUpdated', rooms => {
            setRooms(rooms)
        })

        socket.on('userRoomUpdated', room => {
            console.log('faefew',room)
            setRooms((prevRooms)=>{
                prevRooms.forEach((prevRoom)=>{
                    if (room.roomId === prevRoom.roomId)
                        prevRoom=room
                })
                return prevRooms
            })
        })

        socket.on('roomChanged', room => {
            if (room !== undefined) setCurrRoom(room)
        })

        socket.on('messagesRequested', messages => {
            setChatMessageList(messages)
        })

        return () => {
            socket.removeAllListeners()
            socket.disconnect()
        }
    }, [])

    const fakeScrollDiv = useRef<HTMLDivElement | null>(null)

    if (isLoading) return <PulseLoader color='#36d7b7' />

    return (
        <>
            <Typography variant='subtitle1'>{currRoom === undefined ? 'undef' : currRoom.roomDisplayName}</Typography>

            <MessageSidebar rooms={rooms} socketObject={socket} />

            {currRoom === undefined ? (
                <div>Select a room/ user</div>
            ) : (
                <>
                    <ChatDisplaySection chatMessageList={chatMessageList} fakeScrollDiv={fakeScrollDiv} />
                    <ChatInputBar setChatMessageList={setChatMessageList} currRoom={currRoom?.roomId} />
                </>
            )}
            <RoomInfo selectedRoom={currRoom}  socketObject={socket}/>
        </>
    )
}
