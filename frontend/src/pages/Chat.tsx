import { Box, Button, Collapse, Container, Dialog, Slide, TextField, Typography } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import ChatDisplaySection from '../components/ChatDisplaySection'
import Sidebar from '../components/Sidebar'
import { CredentialContext } from '../contexts/Credentials'
import { socket } from '../socket'
import { PulseLoader } from 'react-spinners'
import { message as MessageFromDB, room as Room } from '../types/prisma.client'
import { MessageSidebar } from '../components/MessageSidebar'
import { RoomInfo } from '../components/RoomInfo'
import { RoomWithParticipants, Settings } from '../types/socket'
import { ProfileSettingsDialog } from '../components/ProfileSettingsDialog'
import { Buffers } from '@react-frontend-developer/buffers'

export type Message = Pick<MessageFromDB, 'senderUsername' | 'content' | 'createdAt' | 'roomId'>

export const generateDummyMessage = (msg: string, sender?: string, roomId?: string): Message => ({
    senderUsername: sender === undefined ? 'undef sender' : sender,
    roomId: roomId === undefined ? 'undef sender' : roomId,
    content: msg,
    createdAt: new Date(),
})

export const imageBufferToURLOrEmptyString = (imageBuffer: Buffers | null) => {
    if (imageBuffer === null) return ''
    const imgBuffer = imageBuffer as ArrayBuffer
    const imageFile = new File([imgBuffer], 'avatar')
    return URL.createObjectURL(imageFile)
}

export const Chat = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [chatMessageList, setChatMessageList] = useState<Message[]>([])

    const { username, isLoggedIn } = useContext(CredentialContext)

    const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>()

    const [rooms, setRooms] = useState<RoomWithParticipants[]>([])

    const [roomInfoVisible, setRoomInfoVisible] = useState(true)

    const [userSettings, setUserSettings] = useState<Settings>({
        userDisplayName: username,
        userDisplayImage: null,
    })

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

        socket.on('userSettingsUpdated', newSettings => {
            setUserSettings(newSettings)
        })

        socket.on('userRoomsUpdated', updatedRooms => {
            setRooms(updatedRooms)
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

        socket.on('roomChanged', roomFromServer => {})

        socket.on('messagesRequested', messages => {
            setChatMessageList(messages)
        })

        return () => {
            socket.removeAllListeners()
            socket.disconnect()
        }
    }, [])

    if (isLoading) return <PulseLoader color='#36d7b7' />

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    minHeight: '100svh',
                    maxWidth: '100vw',
                    alignContent: 'stretch',
                    // overflow: 'hidden',
                }}
            >
                <Sidebar socketObject={socket} userSettings={userSettings} />

                <MessageSidebar
                    rooms={rooms}
                    socketObject={socket}
                    selectedRoomIndex={selectedRoomIndex}
                    setSelectedRoomIndex={setSelectedRoomIndex}
                />

                {selectedRoomIndex === undefined || rooms[selectedRoomIndex] === undefined ? (
                    <Box sx={{ display: 'grid', flex: 1, placeContent: 'center' }}>
                        <Typography variant='h6' align='center'>
                            Join A Room To See The Chat
                            <br />
                            ▰▱▰▱▰▱▰▱▰▱▰▱▰▱
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box
                            sx={{
                                position: 'relative', // Need to set potition here in order for position: absolute to work on RoomBanner component
                                flexBasis: '100%',
                                flexShrink: 1,
                                display: 'grid',
                                background: 'linear-gradient(45deg, #e1eec3, #f05053)',
                                gridTemplateRows: '1fr auto',
                            }}
                        >
                            <ChatDisplaySection
                                chatMessageList={chatMessageList}
                                setChatMessageList={setChatMessageList}
                                currRoom={rooms[selectedRoomIndex]}
                                socketObject={socket}
                                setRoomInfoVisible={setRoomInfoVisible}
                            />
                        </Box>
                        <Box
                            sx={{
                                flexShrink: 0,
                                overflow: 'auto',
                            }}
                        >
                            <Collapse in={roomInfoVisible} orientation='horizontal' sx={{ height: '100%' }}>
                                <RoomInfo socketObject={socket} room={rooms[selectedRoomIndex]} />
                            </Collapse>
                        </Box>
                    </>
                )}
            </Box>
        </>
    )
}
