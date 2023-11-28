import { Box, CircularProgress, IconButton, List, Tooltip, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AddToPhotosRounded } from '@mui/icons-material'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { RoomListItem } from './RoomListItem'
import { CreateRoomDialog } from './CreateRoomDialog'
import { useDialog } from '../hooks/useDialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CredentialContext } from '../contexts/Credentials'
import { Routes } from '../types/routes'
import { useSocket } from '../hooks/useSocket'
import { RoomDetails } from '../types/prisma.client'
import { axiosServerInstance } from '../App'

interface RoomListSidebar {
    roomDispatcher: React.Dispatch<RoomActions>
    rooms: RoomsState
}

export const RoomListSidebar = ({ rooms, roomDispatcher }: RoomListSidebar) => {
    const { handleClose, handleOpen, dialogOpen } = useDialog()

    const { username } = useContext(CredentialContext)

    const socket = useSocket()

    const {
        data: fetchedRooms,
        isFetching: fetchingRoomsInProgress,
        refetch: syncRoomsWithServer,
    } = useQuery({
        queryKey: ['userRooms'],
        queryFn: () =>
            axiosServerInstance.get<RoomDetails[]>(Routes.get.userRooms + `/${username}`).then(res => res.data),
        initialData: [],
    })

    useEffect(() => {
        if (fetchedRooms) roomDispatcher({ type: RoomActionType.initializeRoom, rooms: fetchedRooms })
    }, [fetchedRooms])

    const { mutate: mutateMessageReadStatus } = useMutation({
        mutationFn: (value: { roomId: string; messageStatus: boolean }) =>
            axiosServerInstance
                .put(Routes.put.messageReadStatus + `/${value.roomId}/${username}`, {
                    hasUnreadMessages: value.messageStatus,
                })
                .then(res => res.data),
    })

    useEffect(() => {
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
            socket.removeListener('notification')
        }
    }, [rooms.selectedRoom])

    useEffect(() => {
        socket.on('newRoomCreated', async roomId => {
            syncRoomsWithServer()
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
                // alignContent: 'center',
                alignContent: 'flex-start',
                // justifyItems: 'center'
                backgroundColor: theme => theme.palette.background.light,
            }}
        >
            <Typography pl={2} display={'inline'} sx={{ gridArea: '1 / 1 / 1 / 1', alignSelf: 'center' }}>
                Messages
            </Typography>
            <Tooltip title='Create new room' placement='right'>
                <IconButton onClick={handleOpen} sx={{ justifySelf: 'flex-end', gridArea: '1 / 1 / 1 / 1' }}>
                    <AddToPhotosRounded />
                </IconButton>
            </Tooltip>

            <CreateRoomDialog dialogOpen={dialogOpen} roomDispatcher={roomDispatcher} handleClose={handleClose} />

            {fetchingRoomsInProgress === true ? (
                <CircularProgress />
            ) : (
                <List sx={{ overflowY: 'auto' }}>
                    {rooms.joinedRooms.map((room, i) => {
                        return (
                            <RoomListItem
                                key={room.roomId}
                                roomIndex={i}
                                selectedRoomIndex={rooms.selectedRoom}
                                room={room}
                                roomDispatcher={roomDispatcher}
                                mutateMessageReadStatus={mutateMessageReadStatus}
                            />
                        )
                    })}
                </List>
            )}
        </Box>
    )
}
