import { Box, Collapse, Switch, Typography } from '@mui/material'
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { ChatDisplaySection } from '../components/ChatDisplaySection'
import { CredentialContext } from '../contexts/Credentials'
import { PulseLoader } from 'react-spinners'
import { RoomInfo } from '../components/RoomInfo'
import { Sidebar } from '../components/Sidebar'
import { RoomActionType, roomReducer } from '../reducer/roomReducer'
import { RoomListSidebar } from '../components/RoomListSidebar'
import { useSocket } from '../hooks/useSocket'
import { useDialog } from '../hooks/useDialog'

export const Chat = () => {
    const [isLoading, setIsLoading] = useState(true)

    const socket = useSocket()

    const { username, isLoggedIn } = useContext(CredentialContext)

    const [rooms, roomDispatcher] = useReducer(roomReducer, { selectedRoom: null, joinedRooms: [] })

    const { dialogOpen: roomInfoSidebarOpen, handleToggle: toggleRoomInfoSidebar } = useDialog()

    useEffect(() => {
        if (socket.connected === false && isLoggedIn === true) {
            socket.auth = { username }
            socket.connect()
        }

        setIsLoading(false)

        socket.on('userLeftRoom', (staleUsername, roomId) => {
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

    if (isLoading) return <PulseLoader color='#36d7b7' />

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    height: '100svh',
                    maxWidth: '100vw',
                    alignContent: 'stretch',
                }}
            >
                <Sidebar />

                <RoomListSidebar rooms={rooms} roomDispatcher={roomDispatcher} />

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
                                gridTemplateRows: '1fr auto',
                                background: theme => {
                                    if (theme.palette.mode === 'light')
                                        return 'linear-gradient(135deg, #f4e9e5,#f4dcd0,#eed0d2,#dbd7e4,#e4e8f2)'
                                    const size = '30px'
                                    const loopColor = theme.palette.background.default
                                    const loop = `#0000 46%, ${loopColor} 47% 53%, #0000 54%`

                                    return `radial-gradient(100% 100% at 100% 101%, ${loop}) ${size} ${size},
                                            radial-gradient(100% 100% at 0 0, ${loop}) ${size} ${size},
                                    radial-gradient(100% 100%, ${theme.palette.background.dark} 22%, ${loopColor} 23% 29%, ${theme.palette.background.dark} 30% 34%, ${loopColor} 35% 41%, #0000 42%) ${theme.palette.background.dark}`
                                },
                                backgroundSize: theme => {
                                    if (theme.palette.mode === 'light') return
                                    const size = 30
                                    return `${size * 2}px ${size * 2}px`
                                },
                            }}
                        >
                            <ChatDisplaySection
                                currRoom={rooms.joinedRooms[rooms.selectedRoom]}
                                toggleRoomInfoSidebar={toggleRoomInfoSidebar}
                            />
                        </Box>
                        <Collapse
                            in={roomInfoSidebarOpen}
                            orientation='horizontal'
                            sx={{ minHeight: '100%', flexShrink: 0, overflowY: 'scroll' }}
                            component={Box}
                        >
                            <RoomInfo
                                room={rooms.joinedRooms[rooms.selectedRoom]}
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
