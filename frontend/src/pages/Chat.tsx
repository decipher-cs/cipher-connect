import { Box, Button, Collapse, Container, Dialog, Slide, TextField, Typography } from '@mui/material'
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { ChatDisplaySection } from '../components/ChatDisplaySection'
import { CredentialContext } from '../contexts/Credentials'
import { PulseLoader } from 'react-spinners'
import { RoomInfo } from '../components/RoomInfo'
import { RoomDetails, RoomWithParticipants, User } from '../types/prisma.client'
import { Sidebar } from '../components/Sidebar'
import { MessageListActionType, messageListReducer } from '../reducer/messageListReducer'
import { RoomActionType, roomReducer } from '../reducer/roomReducer'
import { useFetch } from '../hooks/useFetch'
import { Routes } from '../types/routes'
import { RoomListSidebar } from '../components/RoomListSidebar'
import { StyledTextField } from '../components/StyledTextField'
import { useSocket } from '../hooks/useSocket'

export const Chat = () => {
    const [isLoading, setIsLoading] = useState(true)

    const socket = useSocket()

    const [messages, messageDispatcher] = useReducer(messageListReducer, [])

    const { username, isLoggedIn } = useContext(CredentialContext)

    const [rooms, roomDispatcher] = useReducer(roomReducer, { selectedRoom: null, joinedRooms: [] })

    const [roomInfoVisible, setRoomInfoVisible] = useState(false)

    const { startFetching: initializeRooms } = useFetch<RoomDetails[]>(Routes.get.userRooms, true, username)

    const { startFetching: fetchNewRoomDetails } = useFetch<RoomDetails>(Routes.get.userRoom, true)

    const { startFetching: changeMessageReadStatus } = useFetch<string>(
        Routes.put.messageReadStatus,
        true,
        rooms.selectedRoom !== null ? rooms.joinedRooms[rooms.selectedRoom].roomId + '/' + username : ''
    )

    useEffect(() => {
        if (socket.connected === false && isLoggedIn === true) {
            socket.auth = { username }
            socket.connect()
        }

        setIsLoading(false)

        initializeRooms().then(data => {
            roomDispatcher({ type: RoomActionType.initializeRoom, rooms: data })
        })

        socket.on('newRoomCreated', async roomId => {
            const roomDetails = await fetchNewRoomDetails({ method: 'get' }, [username, roomId])
            roomDispatcher({
                type: RoomActionType.addRoom,
                room: roomDetails,
            })
        })

        socket.on('userLeftRoom', (staleUsername, roomId) => {
            console.log(username, staleUsername, roomId)
            if (username === staleUsername) {
                // TODO: maybe this should direclty be after the onClick leave room and not here. event staying close to action
                roomDispatcher({ type: RoomActionType.removeRoom, roomId })
            }
            if (username) roomDispatcher({ type: RoomActionType.removeParticipants, roomId, username: staleUsername })
        })

        socket.on('userJoinedRoom', async (roomId, participants) => {
            roomDispatcher({ type: RoomActionType.addParticipants, roomId, participants })
        })

        socket.on('roomDeleted', roomId => {
            roomDispatcher({ type: RoomActionType.removeRoom, roomId })
        })

        socket.on('userProfileUpdated', profile => {})

        return () => {
            socket.removeAllListeners()
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        socket.on('message', messageFromServer => {
            if (rooms.selectedRoom === null) return

            if (rooms.joinedRooms[rooms.selectedRoom].roomId === messageFromServer.roomId) {
                messageDispatcher({ type: MessageListActionType.add, newMessage: messageFromServer })
            }
        })

        socket.on('notification', roomId => {
            if (rooms.selectedRoom === null) return

            if (rooms.joinedRooms[rooms.selectedRoom].roomId !== roomId) {
                roomDispatcher({
                    type: RoomActionType.changeNotificationStatus,
                    roomId: roomId,
                    unreadMessages: true,
                })
            } else {
                roomDispatcher({
                    type: RoomActionType.changeNotificationStatus,
                    roomId: roomId,
                    unreadMessages: false,
                })
                changeMessageReadStatus({
                    method: 'put',
                    body: JSON.stringify({ hasUnreadMessages: false }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })
            }
        })

        return () => {
            socket.removeListener('message')
            socket.removeListener('notification')
        }
    }, [rooms.selectedRoom])

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
                <Sidebar />

                <RoomListSidebar
                    rooms={rooms}
                    roomDispatcher={roomDispatcher}
                    messageListDispatcher={messageDispatcher}
                />

                {rooms.selectedRoom === null || rooms.joinedRooms[rooms.selectedRoom] === undefined ? (
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
                                currRoom={rooms.joinedRooms[rooms.selectedRoom]}
                                setRoomInfoVisible={setRoomInfoVisible}
                                chatMessageList={messages}
                                messageListDispatcher={messageDispatcher}
                            />
                        </Box>
                        <Collapse
                            in={roomInfoVisible}
                            orientation='horizontal'
                            sx={{ minHeight: '100%', flexShrink: 0, overflowY: 'scroll' }}
                            component={Box}
                        >
                            <RoomInfo
                                room={rooms.joinedRooms[rooms.selectedRoom]}
                                setRoomInfoVisible={setRoomInfoVisible}
                                roomDispatcher={roomDispatcher}
                            />
                        </Collapse>
                    </>
                )}
            </Box>
        </>
    )
}
