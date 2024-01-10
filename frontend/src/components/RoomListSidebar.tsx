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
import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
    AddToPhotosRounded,
    BrokenImageRounded,
    ChatBubbleRounded,
    ClearRounded,
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
import {
    Message,
    MessageContentType,
    MessageWithOptions,
    Room,
    RoomDetails,
    RoomWithParticipantsAndUserRoomArr,
    ServerMessage,
    User,
} from '../types/prisma.client'
import { axiosServerInstance, queryClient } from '../App'
import { useAuth } from '../hooks/useAuth'
import { StyledTextField } from './StyledTextField'
import { ProfileSettings } from './ProfileSettings'
import { AxiosError, isAxiosError } from 'axios'
import Fuse from 'fuse.js'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import { EveryRoomMessage, MessageListAction, MessageListActionType } from '../reducer/messageListReducer'
import { useToast } from '../hooks/useToast'

const searchObjectKeys = ['roomDisplayName', 'participants']

interface RoomListSidebar {
    roomDispatcher: React.Dispatch<RoomActions>
    rooms: RoomsState
    selectedTab: 'messages' | 'favourates' | 'settings'
    messageDispatcher: React.Dispatch<MessageListAction>
    messages: EveryRoomMessage
}

export const RoomListSidebar = memo((props: RoomListSidebar) => {
    const { messages, messageDispatcher, rooms, roomDispatcher, selectedTab } = props
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
    } = useQuery({
        queryKey: ['fetchedRooms', username],
        queryFn: async () => {
            const response = await axiosServerInstance.get<RoomWithParticipantsAndUserRoomArr[]>(Routes.get.room)
            return response.data
        },
    })

    useEffect(() => {
        if (roomFetchStatus !== 'success') return
        for (const room of fetchedRooms) {
            axiosServerInstance
                .get<MessageWithOptions[]>(Routes.get.messages + `/${room.roomId}?messageQuantity=${5}`)
                .then(res => {
                    messageDispatcher({
                        type: MessageListActionType.initializeMessages,
                        roomId: room.roomId,
                        newMessages: res.data.map(msg => {
                            return {
                                ...msg,
                                deliveryStatus: 'delivered',
                                readByUsernames: new Set(),
                            } satisfies Message
                        }) satisfies MessageWithOptions[],
                    })
                    const userRoomArr = fetchedRooms.find(({ roomId }) => roomId === room.roomId)?.userRoomArr
                    if (userRoomArr?.length && userRoomArr?.length > 0) {
                        userRoomArr.forEach(userRoom => {
                            if (!userRoom.lastReadMessageId) return
                            messageDispatcher({
                                type: MessageListActionType.addUsernameToReadByList,
                                roomId: room.roomId,
                                updatedReadByDetails: {
                                    newlyReadMessageId: userRoom.lastReadMessageId,
                                    readByChangedForUsername: userRoom.username,
                                },
                            })
                        })

                        return res.data
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        }
    }, [fetchedRooms])

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

    const [searchQuery, setSearchQuery] = useState('')

    const { matchedQuery: queryMetchedRooms } = useFuzzySearch(searchQuery, rooms.joinedRooms, searchObjectKeys)

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
        socket.on('roomDetailsUpdated', roomId => {
            // roomDispatcher({type: RoomActionType.addRoom, rooms: })
            refetch()
        })

        return () => {
            socket.removeListener('roomCreated')
        }
    }, [])
    useEffect(() => {
        socket.on('roomCreated', () => {
            // roomDispatcher({type: RoomActionType.addRoom, rooms: })
            refetch()
        })

        return () => {
            socket.removeListener('roomCreated')
        }
    }, [])

    useEffect(() => {
        socket.on('roomParticipantsChanged', (roomId, changeType, updatedMemberIds) => {
            const room = rooms.joinedRooms.find(room => room.roomId === roomId)
            if (!room) {
                refetch()
            } else if (changeType === 'membersJoined') {
                roomDispatcher({
                    type: RoomActionType.addParticipantsToRoom,
                    roomId,
                    participants: updatedMemberIds,
                })
            } else if (changeType === 'membersLeft') {
                roomDispatcher({
                    type: RoomActionType.removeParticipantsFromRoom,
                    roomId,
                    usernamesToRemove: updatedMemberIds,
                })
            }
        })

        return () => {
            socket.removeListener('roomParticipantsChanged')
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

    const getMostRecentMessage = (roomId: Room['roomId']): string => {
        const roomMessages = messages[roomId]

        const mostRecentMessage = roomMessages?.at(-1)

        if (!roomMessages || !mostRecentMessage) return ''

        if (mostRecentMessage.contentType === MessageContentType.text) return mostRecentMessage.content

        return mostRecentMessage.contentType
    }

    if (roomFetchStatus === 'error') return <BrokenImageRounded sx={{ justifySelf: 'center', mt: '100%' }} />

    return (
        <>
            <Typography pl={2} variant='h6' display={'inline'} sx={{ gridArea: '1 / 1 / 1 / 1', alignSelf: 'center' }}>
                {selectedTab.toUpperCase()}
            </Typography>
            <Tooltip title='Create new room' placement='right'>
                <IconButton onClick={handleOpen} sx={{ justifySelf: 'flex-end', mr: 1.5, gridArea: '1 / 1 / 1 / 1' }}>
                    <AddToPhotosRounded />
                </IconButton>
            </Tooltip>

            <CreateRoomDialog dialogOpen={dialogOpen} roomDispatcher={roomDispatcher} handleClose={handleClose} />

            {selectedTab !== 'settings' ? (
                <StyledTextField
                    sx={{ m: 2, '& .MuiInputBase-root': { background: theme => theme.palette.background.default } }}
                    placeholder='search for a room'
                    value={searchQuery}
                    onChange={e => {
                        setSearchQuery(e.target.value)
                    }}
                    InputProps={{
                        endAdornment: (
                            <>
                                <InputAdornment position='end'>
                                    <IconButton disabled={searchQuery.length < 1} onClick={() => setSearchQuery('')}>
                                        <ClearRounded />
                                    </IconButton>
                                </InputAdornment>
                                <InputAdornment position='end'>
                                    <SearchRounded color='disabled' />
                                </InputAdornment>
                            </>
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
                    {selectedTab !== 'settings' ? (
                        <>
                            <ListSubheader sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PushPinRounded fontSize='inherit' />
                                <span>pinned rooms</span>
                            </ListSubheader>
                            <List sx={{ overflowY: 'auto', mb: 3 }}>
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
                                                mostRecentMessage={getMostRecentMessage(room.roomId)}
                                            />
                                        )
                                })}
                            </List>
                        </>
                    ) : null}

                    {selectedTab === 'messages' && (
                        <>
                            <ListSubheader sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ChatBubbleRounded fontSize='inherit' sx={{ mr: 1 }} />
                                All Rooms
                            </ListSubheader>
                            <List sx={{ overflowY: 'auto' }}>
                                {queryMetchedRooms.map((room, i) => {
                                    return (
                                        <RoomListItem
                                            key={room.roomId}
                                            thisRoomIndex={i}
                                            selectedRoomIndex={rooms.selectedRoomIndex}
                                            room={room}
                                            usersInfo={rooms.usersInfo}
                                            roomDispatcher={roomDispatcher}
                                            mutateMessageReadStatus={mutateMessageReadStatus}
                                            mostRecentMessage={getMostRecentMessage(room.roomId)}
                                        />
                                    )
                                })}
                            </List>
                        </>
                    )}

                    {selectedTab === 'favourates' && (
                        <>
                            <ListSubheader sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TryRounded fontSize='inherit' sx={{ mr: 1 }} />
                                Bookmarked Rooms
                            </ListSubheader>
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
                                                mostRecentMessage={getMostRecentMessage(room.roomId)}
                                            />
                                        )
                                })}
                            </List>
                        </>
                    )}
                </>
            )}

            {selectedTab === 'settings' && <ProfileSettings />}
        </>
    )
})
