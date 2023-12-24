import {
    Box,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListSubheader,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import {
    AddToPhotosRounded,
    BrokenImageRounded,
    ChatBubbleRounded,
    PushPinRounded,
    SearchRounded,
    TryRounded,
} from '@mui/icons-material'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { RoomListItem } from './RoomListItem'
import { CreateRoomDialog } from './CreateRoomDialog'
import { useDialog } from '../hooks/useDialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Routes } from '../types/routes'
import { useSocket } from '../hooks/useSocket'
import { RoomDetails, User } from '../types/prisma.client'
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

    const {
        data: fetchedRooms,
        isFetching: fetchingRoomsInProgress,
        refetch,
        status: roomFetchStatus,
        // refetch: syncRoomsWithServer,
    } = useQuery({
        queryKey: ['fetchedRooms', username],
        queryFn: async () => {
            const response = await axiosServerInstance.get<RoomDetails[]>(Routes.get.userRooms + `/${username}`)
            return response.data
        },
    })

    useEffect(() => {
        if (!fetchedRooms) return

        const usersToBeFetched: Set<User['username']> = new Set()

        fetchedRooms.forEach(room => {
            room.participants.forEach(username => {
                if (!rooms?.usersInfo[username]) {
                    usersToBeFetched.add(username)
                }
            })
        })

        if (usersToBeFetched.size >= 1) {
            axiosServerInstance
                .get<User[]>(Routes.get.users, {
                    params: { usernames: Array.from(usersToBeFetched) },
                })
                .then(res => {
                    const users = res.data
                    roomDispatcher({ type: RoomActionType.addUsers, details: users })
                    return users
                })
        }

        return () => {}
    }, [fetchedRooms])

    useEffect(() => {
        if (roomFetchStatus === 'success' && fetchedRooms)
            roomDispatcher({ type: RoomActionType.initilizeRooms, rooms: [...fetchedRooms] })
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
        socket.on('roomCreated', () => {
            console.log('created')
            // roomDispatcher({type: RoomActionType.addRoom, rooms: })
            refetch()
        })

        return () => {
            socket.removeListener('roomCreated')
        }
    }, [])

    useEffect(() => {
        socket.on('roomMembersChanged', (roomId, updatedMemberIds) => {
            console.log('members changed')
            if (rooms.joinedRooms.find(r => r.roomId === roomId)) {
                // TODO: update participants
            } else {
                console.log('refetching')
                refetch()
                // TODO: handle by dispatcing action
                // roomDispatcher({type: RoomActionType.addRoom, rooms: })
            }
        })

        return () => {
            socket.removeListener('roomMembersChanged')
        }
    }, [])

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

    if (roomFetchStatus === 'error') return <BrokenImageRounded sx={{ justifySelf: 'center', mt: '100%' }} />

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

            {selectedTab !== 'settings' ? (
                <StyledTextField
                    sx={{ m: 2, '& .MuiInputBase-root': { background: theme => theme.palette.background.default } }}
                    placeholder='search for a room'
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <SearchRounded color='disabled' />
                            </InputAdornment>
                        ),
                    }}
                />
            ) : null}

            {roomFetchStatus === 'loading' ? (
                <List>
                    {Array(7)
                        .fill('')
                        .map((_, i) => (
                            <ListItem divider disableGutters key={i}>
                                <Skeleton width={'100%'} height={56} animation='wave' variant='rectangular'></Skeleton>
                            </ListItem>
                        ))}
                </List>
            ) : (
                <>
                    <List sx={{ overflowY: 'auto' }}>
                        <ListSubheader>
                            <PushPinRounded fontSize='inherit' sx={{ mr: 1 }} />
                            pinned rooms
                        </ListSubheader>
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
                            <ListSubheader>
                                <ChatBubbleRounded fontSize='inherit' sx={{ mr: 1 }} />
                                All Rooms
                            </ListSubheader>
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
                            <ListSubheader>
                                <TryRounded fontSize='inherit' sx={{ mr: 1 }} />
                                Bookmarked Rooms
                            </ListSubheader>
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
                </>
            )}

            {selectedTab === 'settings' && <ProfileSettings />}
        </>
    )
}
