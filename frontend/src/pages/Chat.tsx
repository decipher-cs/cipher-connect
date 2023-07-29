import { Box, Button, Container, Dialog, TextField, Typography } from '@mui/material'
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

    const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | undefined>(undefined)

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
            // if (targetRoomId === undefined || targetRoomId !== rooms[selectedRoomIndex].roomId) {
            //     // TODO send notification for a new message
            // }
        })

        socket.on('userRoomsUpdated', rooms => {
            setRooms(rooms)
        })

        socket.on('userRoomUpdated', room => {
            setRooms(prevRooms => {
                const newRooms: RoomWithParticipants[] = structuredClone(prevRooms)
                const index = newRooms.findIndex(prevRoom => room.roomId === prevRoom.roomId)
                newRooms[index] = room
                return newRooms
            })
            // socket.emit('roomSelected', room.roomId)
        })

        socket.on('roomChanged', roomFromServer => {
            // const roomIndex = findSelectedRoomIndex(roomFromServer.roomId)
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
            <Typography variant='subtitle1'>
                {selectedRoomIndex === undefined ? 'Room not selected' : rooms[selectedRoomIndex].roomDisplayName}
            </Typography>

            <Box sx={{ display: 'flex',  }}>
                <MessageSidebar rooms={rooms} socketObject={socket} setSelectedRoomIndex={setSelectedRoomIndex} />

                {selectedRoomIndex === undefined ? (
                    <div>Select a room/ user</div>
                ) : (
                    <Box
                        sx={{
                            border: 'solid blue 3px',
                            flexBasis: '50%',
                        }}
                    >
                        <ChatDisplaySection chatMessageList={chatMessageList} fakeScrollDiv={fakeScrollDiv} />
                        <ChatInputBar
                            setChatMessageList={setChatMessageList}
                            currRoom={rooms[selectedRoomIndex]?.roomId}
                        />
                    </Box>
                )}

                <RoomInfo rooms={rooms} selectedRoomIndex={selectedRoomIndex} socketObject={socket} />
            </Box>
        </>
    )
}
