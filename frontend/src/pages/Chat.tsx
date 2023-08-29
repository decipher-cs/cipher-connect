import { Box, Button, Collapse, Container, Dialog, Slide, TextField, Typography } from '@mui/material'
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { ChatDisplaySection } from '../components/ChatDisplaySection'
import { CredentialContext } from '../contexts/Credentials'
import { socket } from '../socket'
import { PulseLoader } from 'react-spinners'
import { message as Message, MessageContentType, room as Room } from '../types/prisma.client'
import { MessageSidebar } from '../components/MessageSidebar'
import { RoomInfo } from '../components/RoomInfo'
import { RoomWithParticipants, Settings } from '../types/socket'
import { ProfileSettingsDialog } from '../components/ProfileSettingsDialog'
import { Buffers } from '@react-frontend-developer/buffers'
import { Sidebar } from '../components/Sidebar'
import { arrayBufferToObjectUrlConverter } from '../utils'

// TODO: use arrayBufferToObjectURLConverter function form utils.ts
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

    const [roomInfoVisible, setRoomInfoVisible] = useState(false)

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

        socket.on('message', messageFromServer => {
            if (messageFromServer.contentType === MessageContentType.text) {
                setChatMessageList(prev => prev.concat(messageFromServer))
            } else if (messageFromServer) {
                const objectURL = arrayBufferToObjectUrlConverter(messageFromServer.content)
                setChatMessageList(prev => prev.concat({ ...messageFromServer, content: objectURL }))
            } else throw 'Unknown message type'
            // TODO send notification for a new message
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
                    height: '100svh',
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
                        <Collapse
                            in={roomInfoVisible}
                            orientation='horizontal'
                            sx={{ height: '100%', flexShrink: 0 }}
                            component={Box}
                        >
                            <RoomInfo
                                socketObject={socket}
                                room={rooms[selectedRoomIndex]}
                                setRoomInfoVisible={setRoomInfoVisible}
                            />
                        </Collapse>
                    </>
                )}
            </Box>
        </>
    )
}
