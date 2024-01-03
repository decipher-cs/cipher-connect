import { Box, Collapse, Typography } from '@mui/material'
import { useEffect, useId, useReducer, useRef, useState } from 'react'
import { ChatDisplaySection } from '../components/ChatDisplaySection'
import { RoomInfo } from '../components/RoomInfo'
import { Sidebar } from '../components/Sidebar'
import { RoomActions, RoomActionType, roomReducer, RoomsState } from '../reducer/roomReducer'
import { RoomListSidebar } from '../components/RoomListSidebar'
import { useSocket } from '../hooks/useSocket'
import { useDialog } from '../hooks/useDialog'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { axiosServerInstance } from '../App'
import { Routes } from '../types/routes'
import { RoomDetails } from '../types/prisma.client'
import { MessageListActionType, messageListReducer } from '../reducer/messageListReducer'

export const Chat = () => {
    const socket = useSocket()

    const {
        authStatus: { username, isLoggedIn },
    } = useAuth()

    const { dialogOpen: roomInfoSidebarOpen, handleToggle: toggleRoomInfoSidebar } = useDialog()

    const [rooms, roomDispatcher] = useReducer(roomReducer, { selectedRoomIndex: null, joinedRooms: [], usersInfo: {} })

    const [everyRoomMessage, messageDispatcher] = useReducer(messageListReducer, {})

    // TODO: better typingn for tab strings
    const [selectedTab, setSelectedTab] = useState<'messages' | 'favourates' | 'settings'>('messages')

    const handleTabChange = (newTab: 'messages' | 'favourates' | 'settings') => setSelectedTab(newTab)

    useEffect(() => {
        socket.on('message', (message, cb) => {
            messageDispatcher({
                type: MessageListActionType.append,
                roomId: message.roomId,
                newMessage: [
                    {
                        ...message,
                        deliveryStatus: 'delivered',
                        messageOptions: {
                            messageKey: message.key,
                            username: message.senderUsername,
                            isHidden: false,
                            isNotificationMuted: false,
                            isMarkedFavourite: false,
                            isPinned: false,
                        },
                    },
                ],
            })
        })

        return () => {
            socket.removeListener('message')
        }
    }, [])

    useEffect(() => {
        socket.on('userLeftRoom', (staleUsername, roomId) => {
            if (username === staleUsername) {
                // TODO: maybe this should direclty be after the onClick leave room and not here. event staying close to action
                roomDispatcher({ type: RoomActionType.removeRoom, roomId })
            }
            if (username)
                roomDispatcher({
                    type: RoomActionType.removeParticipantsFromRoom,
                    roomId,
                    usernamesToRemove: [staleUsername],
                })
        })

        socket.on('userJoinedRoom', async (roomId, participants) => {
            // roomDispatcher({ type: RoomActionType.addParticipants, roomId, participants })
        })

        socket.on('roomDeleted', roomId => {
            roomDispatcher({ type: RoomActionType.removeRoom, roomId })
        })

        socket.on('userProfileUpdated', profile => {})

        return () => {
            socket.removeListener('userLeftRoom')
            socket.removeListener('userJoinedRoom')
            socket.removeListener('roomDeleted')
            socket.removeListener('userProfileUpdated')
        }
    }, [])

    const selectedRoom = rooms.selectedRoomIndex !== null ? rooms.joinedRooms[rooms.selectedRoomIndex] : null

    const message = selectedRoom ? everyRoomMessage[selectedRoom.roomId] : null

    if (!isLoggedIn || !username) return <Navigate to='/login' />

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    height: '100svh',
                    width: '100vw',
                    alignContent: 'stretch',
                }}
            >
                <Sidebar selectedTab={selectedTab} handleTabChange={handleTabChange} />

                <Box
                    sx={{
                        flexShrink: 1,
                        flexGrow: 0,
                        minWidth: '28%',

                        display: 'grid',
                        alignContent: 'flex-start',
                        pt: 1.5,
                        backgroundColor: theme => theme.palette.background.light,
                    }}
                >
                    <RoomListSidebar
                        messages={everyRoomMessage}
                        rooms={rooms}
                        roomDispatcher={roomDispatcher}
                        selectedTab={selectedTab}
                        messageDispatcher={messageDispatcher}
                    />
                </Box>

                {!selectedRoom || !message ? (
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
                                gridTemplateRows: '1fr auto',
                                background: theme => theme.design.background,
                                backgroundSize: theme =>
                                    theme.palette.mode === 'dark' ? theme.design.backgroundSize : null,
                            }}
                        >
                            <ChatDisplaySection
                                currRoom={selectedRoom}
                                toggleRoomInfoSidebar={toggleRoomInfoSidebar}
                                users={rooms.usersInfo}
                                messages={message}
                                messageDispatcher={messageDispatcher}
                            />
                        </Box>
                        <Collapse
                            in={roomInfoSidebarOpen}
                            orientation='horizontal'
                            sx={{ minHeight: '100%', flexShrink: 0, overflowY: 'scroll' }}
                            component={Box}
                        >
                            <RoomInfo
                                room={selectedRoom}
                                handleToggleRoomInfoSidebar={toggleRoomInfoSidebar}
                                roomDispatcher={roomDispatcher}
                            />
                        </Collapse>
                    </>
                )}
            </Box>
        </>
    )
}
