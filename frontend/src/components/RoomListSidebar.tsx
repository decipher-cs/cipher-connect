import { Box, CircularProgress, IconButton, InputAdornment, List, Tooltip, Typography } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import { AddToPhotosRounded, BrokenImageRounded, SearchRounded } from '@mui/icons-material'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { RoomListItem } from './RoomListItem'
import { CreateRoomDialog } from './CreateRoomDialog'
import { useDialog } from '../hooks/useDialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Routes } from '../types/routes'
import { useSocket } from '../hooks/useSocket'
import { RoomDetails } from '../types/prisma.client'
import { axiosServerInstance, queryClient } from '../App'
import { useAuth } from '../hooks/useAuth'
import { StyledTextField } from './StyledTextField'
import { ProfileSettings } from './ProfileSettings'
import { AxiosError, isAxiosError } from 'axios'

interface RoomListSidebar {
    roomDispatcher: React.Dispatch<RoomActions>
    rooms: RoomsState
    selectedTab: 'messages' | 'favourates' | 'settings'
}

export const RoomListSidebar = ({ rooms, roomDispatcher, selectedTab }: RoomListSidebar) => {
    const { handleClose, handleOpen, dialogOpen } = useDialog()

    const {
        authStatus: { username },
    } = useAuth()

    const socket = useSocket()

    /* const {
        data: fetchedRooms,
        isFetching: fetchingRoomsInProgress,
        refetch: syncRoomsWithServer,
    } = useQuery({
        queryKey: ['userRooms'],
        queryFn: () =>
            axiosServerInstance.get<RoomDetails[]>(Routes.get.userRooms + `/${username}`).then(res => res.data),
        initialData: [],
    }) */

    const [fetchStatus, setFetchStatus] = useState<'fetching' | 'error' | 'success'>('fetching')

    useEffect(() => {
        const controller = new AbortController()

        axiosServerInstance
            .get<RoomDetails[]>(Routes.get.userRooms + `/${username}`, { signal: controller.signal, retry: 3 })
            .then(res => {
                const fetchedRooms = res.data
                if (fetchedRooms) {
                    roomDispatcher({ type: RoomActionType.addRoom, rooms: [...fetchedRooms] })
                    setFetchStatus('success')
                } else setFetchStatus('error')
            })
            .catch(err => setFetchStatus('error'))

        return () => {
            controller.abort()
        }
    }, [])


    const { mutate: mutateMessageReadStatus } = useMutation({
        mutationFn: (value: { roomId: string; messageStatus: boolean }) =>
            axiosServerInstance
                .put(Routes.put.messageReadStatus + `/${value.roomId}/${username}`, {
                    hasUnreadMessages: value.messageStatus,
                })
                .then(res => res.data),
    })

    // useEffect(() => {
    //     socket.on('notification', roomId => {
    //         if (rooms.selectedRoom === null) return
    //
    //         if (rooms.joinedRooms[rooms.selectedRoom].roomId !== roomId) {
    //             roomDispatcher({
    //                 type: RoomActionType.changeNotificationStatus,
    //                 roomId: roomId,
    //                 unreadMessages: true,
    //             })
    //         } else {
    //             roomDispatcher({
    //                 type: RoomActionType.changeNotificationStatus,
    //                 roomId: roomId,
    //                 unreadMessages: false,
    //             })
    //             mutateMessageReadStatus({ roomId, messageStatus: false })
    //         }
    //     })
    //
    //     return () => {
    //         socket.removeListener('notification')
    //     }
    // }, [rooms.selectedRoom])
    //
    // useEffect(() => {
    //     socket.on('newRoomCreated', async roomId => {
    //         syncRoomsWithServer()
    //     })
    //     return () => {
    //         socket.removeListener('newRoomCreated')
    //     }
    // }, [])

    if (fetchStatus === 'fetching') return <CircularProgress />

    if (fetchStatus === 'error') return <BrokenImageRounded />

    return (
        <>
            <Typography pl={2} variant='h6' display={'inline'} sx={{ gridArea: '1 / 1 / 1 / 1', alignSelf: 'center' }}>
                {selectedTab.toUpperCase()}
            </Typography>
            <Tooltip title='Create new room' placement='right'>
                <IconButton onClick={handleOpen} sx={{ justifySelf: 'flex-end', gridArea: '1 / 1 / 1 / 1' }}>
                    <AddToPhotosRounded />
                </IconButton>
            </Tooltip>

            <CreateRoomDialog dialogOpen={dialogOpen} roomDispatcher={roomDispatcher} handleClose={handleClose} />

            <StyledTextField
                sx={{ m: 2, '& .MuiInputBase-root': { background: theme => theme.palette.background.default } }}
                placeholder='search anything'
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <SearchRounded color='disabled' />
                        </InputAdornment>
                    ),
                }}
            />

            <List sx={{ overflowY: 'auto' }}>
                {rooms.joinedRooms.map((room, i) => {
                    if (room.isPinned)
                        return (
                            <RoomListItem
                                key={room.roomId}
                                thisRoomIndex={i}
                                selectedRoomIndex={rooms.selectedRoomIndex}
                                usersInfo={rooms.usersInfo}
                                room={room}
                                roomDispatcher={roomDispatcher}
                                mutateMessageReadStatus={mutateMessageReadStatus}
                            />
                        )
                })}
            </List>

            {selectedTab === 'messages' && (
                <List sx={{ overflowY: 'auto' }}>
                    {rooms.joinedRooms.map((room, i) => {
                        if (!room.isPinned)
                            return (
                                <RoomListItem
                                    key={room.roomId}
                                    thisRoomIndex={i}
                                    selectedRoomIndex={rooms.selectedRoomIndex}
                                    room={room}
                                    usersInfo={rooms.usersInfo}
                                    roomDispatcher={roomDispatcher}
                                    mutateMessageReadStatus={mutateMessageReadStatus}
                                />
                            )
                    })}
                </List>
            )}

            {selectedTab === 'favourates' && (
                <List sx={{ overflowY: 'auto' }}>
                    {rooms.joinedRooms.map((room, i) => {
                        if (room.isMarkedFavourite && !room.isPinned)
                            return (
                                <RoomListItem
                                    key={room.roomId}
                                    thisRoomIndex={i}
                                    selectedRoomIndex={rooms.selectedRoomIndex}
                                    room={room}
                                    roomDispatcher={roomDispatcher}
                                    usersInfo={rooms.usersInfo}
                                    mutateMessageReadStatus={mutateMessageReadStatus}
                                />
                            )
                    })}
                </List>
            )}

            {selectedTab === 'settings' && <ProfileSettings />}
        </>
    )
}
