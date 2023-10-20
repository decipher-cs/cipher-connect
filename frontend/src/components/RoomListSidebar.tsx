import { Box, Button, IconButton, List, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AddToPhotosRounded, BorderColorRounded } from '@mui/icons-material'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { RoomListItem } from './RoomListItem'
import { MessageListAction } from '../reducer/messageListReducer'
import { CreateRoomDialog } from './CreateRoomDialog'
import { useDialog } from '../hooks/useDialog'
import { useQuery } from '@tanstack/react-query'
import { CredentialContext } from '../contexts/Credentials'
import { Routes } from '../types/routes'
import { useSocket } from '../hooks/useSocket'
import { RoomDetails } from '../types/prisma.client'
import axios from 'axios'

interface RoomListSidebar {
    roomDispatcher: React.Dispatch<RoomActions>
    rooms: RoomsState
    // messageListDispatcher: React.Dispatch<MessageListAction>
}

export const RoomListSidebar = ({ rooms, roomDispatcher }: RoomListSidebar) => {
    const { handleClose, handleOpen, dialogOpen } = useDialog()

    const { username } = useContext(CredentialContext)

    const socket = useSocket()

    const [newRoomId, setNewRoomId] = useState<string>()

    const { data: newRoom } = useQuery({
        queryKey: ['getRoomDetails', newRoomId],
        queryFn: () => axios.get<RoomDetails>(Routes.get.userRoom + `/${username}/${newRoomId}`).then(res => res.data),
        enabled: newRoomId !== undefined,
    })

    useEffect(() => {
        newRoom && roomDispatcher({ type: RoomActionType.addRoom, room: newRoom })
    }, [newRoom])

    useEffect(() => {
        socket.on('newRoomCreated', async roomId => {
            setNewRoomId(roomId)
        })
        return () => {
            socket.removeListener('newRoomCreated')
        }
    }, [])

    return (
        <Box
            sx={{
                flexShrink: 0,
                flexGrow: 0,
                width: '23%',
                minWidth: 'max-content',

                display: 'grid',
                alignContent: 'flex-start',
            }}
        >
            <Typography pl={2} display={'inline'} sx={{ gridArea: '1 / 1 / 1 / 1', alignSelf: 'center' }}>
                Messages
            </Typography>
            <IconButton onClick={handleOpen} sx={{ justifySelf: 'flex-end', gridArea: '1 / 1 / 1 / 1', pr: 2 }}>
                <AddToPhotosRounded />
            </IconButton>

            <CreateRoomDialog dialogOpen={dialogOpen} roomDispatcher={roomDispatcher} handleClose={handleClose} />

            <List sx={{ overflowY: 'auto' }}>
                {rooms.joinedRooms.map((room, i) => {
                    return (
                        <RoomListItem
                            key={room.roomId}
                            roomIndex={i}
                            selectedRoomIndex={rooms.selectedRoom}
                            room={room}
                            roomDispatcher={roomDispatcher}
                            // messageListDispatcher={messageListDispatcher}
                        />
                    )
                })}
            </List>
        </Box>
    )
}
