import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Collapse,
    Container,
    Dialog,
    Slide,
    TextField,
    Typography,
} from '@mui/material'
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { ChatDisplaySection } from '../components/ChatDisplaySection'
import { CredentialContext } from '../contexts/Credentials'
import { PulseLoader } from 'react-spinners'
import { RoomInfo } from '../components/RoomInfo'
import { RoomDetails, RoomWithParticipants, User } from '../types/prisma.client'
import { Sidebar } from '../components/Sidebar'
import { MessageListActionType, messageListReducer } from '../reducer/messageListReducer'
import { RoomActionType, roomReducer } from '../reducer/roomReducer'
import { Routes } from '../types/routes'
import { RoomListSidebar } from '../components/RoomListSidebar'
import { useSocket } from '../hooks/useSocket'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ImageEditorDialog } from '../components/ImageEditorDialog'
import { useImageEditor } from '../hooks/useImageEditor'

export const Chat = () => {
    const [isLoading, setIsLoading] = useState(true)

    const socket = useSocket()

    const [messages, messageDispatcher] = useReducer(messageListReducer, [])

    const { username, isLoggedIn } = useContext(CredentialContext)

    const { data: fetchedRooms, isLoading: fetchingRoomsInProgress } = useQuery({
        queryKey: ['initializeRooms'],
        queryFn: () => axios.get<RoomDetails[]>(Routes.get.userRooms + `/${username}`).then(res => res.data),
    })

    const [rooms, roomDispatcher] = useReducer(roomReducer, { selectedRoom: null, joinedRooms: [] })

    useEffect(() => {
        fetchedRooms && roomDispatcher({ type: RoomActionType.initializeRoom, rooms: fetchedRooms })
    }, [fetchedRooms])

    const [roomInfoVisible, setRoomInfoVisible] = useState(false)

    const { mutate: mutateMessageReadStatus } = useMutation({
        mutationFn: (value: { roomId: string; messageStatus: boolean }) =>
            axios
                .put(Routes.put.messageReadStatus + `/${value.roomId}/${username}`, {
                    hasUnreadMessages: value.messageStatus,
                })
                .then(res => res.data),
    })

    useEffect(() => {
        if (socket.connected === false && isLoggedIn === true) {
            socket.auth = { username }
            socket.connect()
        }

        setIsLoading(false)

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
                mutateMessageReadStatus({ roomId, messageStatus: false })
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

                {fetchingRoomsInProgress === true ? (
                    <CircularProgress />
                ) : (
                    <RoomListSidebar
                        rooms={rooms}
                        roomDispatcher={roomDispatcher}
                        messageListDispatcher={messageDispatcher}
                    />
                )}

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
