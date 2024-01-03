import { Box, Button, ButtonGroup, CircularProgress, Container, List, ListItem } from '@mui/material'
import { createRef, forwardRef, useCallback, useContext, useEffect, useLayoutEffect, useReducer, useRef } from 'react'
import React, { useState } from 'react'
import { MessageContentType, RoomWithParticipants, ServerMessage, User } from '../types/prisma.client'
import { MessageTile } from './MessageTile'
import { ChatInputBar } from './ChatInputBar'
import { RoomBanner } from './RoomBanner'
import { Message } from '../types/prisma.client'
import { MessageListAction, MessageListActionType, messageListReducer } from '../reducer/messageListReducer'
import { Routes } from '../types/routes'
import { TypingStatus } from '../types/socket'
import { roomReducer, RoomsState } from '../reducer/roomReducer'
import { useSocket } from '../hooks/useSocket'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { axiosServerInstance } from '../App'
import { PulseLoader } from 'react-spinners'
import { AudioPlayer } from './AudioPlayer'
import Mark from 'mark.js'
import { useAuth } from '../hooks/useAuth'
import { Components, Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { ArrowDownwardRounded, ArrowUpwardRounded } from '@mui/icons-material'

export interface ChatDisplaySectionProps {
    currRoom: RoomsState['joinedRooms'][0]
    toggleRoomInfoSidebar: () => void
    users: RoomsState['usersInfo']
    messages: Message[]
    messageDispatcher: React.Dispatch<MessageListAction>
}

export const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    const { currRoom, users, toggleRoomInfoSidebar, messageDispatcher, messages } = props

    const {
        authStatus: { username },
    } = useAuth()

    const socket = useSocket()

    const messageContainer = useRef<HTMLElement>(null)

    const virtuosoRef = useRef<VirtuosoHandle>(null)

    const { data: messageCount, status: messageCountFetchStatus } = useQuery({
        queryKey: ['messageSize', currRoom.roomId],
        queryFn: () =>
            axiosServerInstance.get<number>(Routes.get.messageCount + '/' + currRoom.roomId).then(res => {
                if (typeof Number(res.data) === 'number') {
                    return Number(res.data)
                } else throw new Error('incorrect type recieved from server while fetching message count')
            }),
    })

    const [firstItemIndex, setFirstItemIndex] = useState(100000)

    useEffect(() => {
        if (messageCount && messageCountFetchStatus === 'success') setFirstItemIndex(messageCount)
    }, [messageCount])

    const messageFetchCount = 10

    const {
        data: serverMessages,
        status,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        enabled: messageCount !== undefined,
        queryKey: ['messages', currRoom.roomId],
        queryFn: ({ pageParam }) =>
            axiosServerInstance
                .get<ServerMessage[]>(
                    Routes.get.messages +
                        `/${currRoom.roomId}?messageQuantity=${messageFetchCount}&${
                            pageParam ? 'cursor=' + pageParam : ''
                        }`
                )
                .then(res => {
                    const result: Message[] = res.data.map(msg => ({ ...msg, deliveryStatus: 'delivered' }))
                    return result
                }),

        getNextPageParam: (lastPage, _) => lastPage.at(0)?.key,
    })

    useEffect(() => {
        if (!serverMessages?.pages?.at(-1)) return

        const messages = serverMessages.pages.slice().at(-1) ?? []

        messageDispatcher({
            type: MessageListActionType.prepend,
            newMessage: messages,
            roomId: currRoom.roomId,
        })
    }, [serverMessages?.pages, serverMessages?.pageParams])

    const [usersCurrentlyTyping, setUsersCurrentlyTyping] = useState<User['username'][] | null>(null)

    useEffect(() => {
        socket.on('typingStatusChanged', (status, roomId, username) => {
            if (roomId !== currRoom.roomId) return
            if (status === TypingStatus.typing) {
                setUsersCurrentlyTyping(p => {
                    if (p === null) return [username]
                    if (p.includes(username)) return p
                    return p.concat(username)
                })
            } else if (status === TypingStatus.notTyping) {
                setUsersCurrentlyTyping(p => {
                    if (p === null) return p
                    if (p.includes(username)) return p.filter(pUsername => pUsername !== username)
                    return p
                })
            }
        })
        return () => {
            socket.removeListener('typingStatusChanged')
        }
    }, [usersCurrentlyTyping, currRoom.roomId])

    useEffect(() => {
        socket.on('messageDeleted', (messageKey, roomId) => {
            if (currRoom.roomId === roomId) {
                messageDispatcher({ type: MessageListActionType.remove, messageKey })
            }
        })

        return () => {
            socket.removeListener('messageDeleted')
        }
    }, [currRoom.roomId])

    useEffect(() => {
        socket.on('textMessageUpdated', (key, content, roomId, editedAt) => {
            if (roomId === currRoom.roomId) {
                messageDispatcher({
                    type: MessageListActionType.edit,
                    updatedMessage: { content, key, editedAt, deliveryStatus: 'delivered' },
                    roomId: currRoom.roomId,
                })
            }
        })

        return () => {
            socket.removeListener('textMessageUpdated')
        }
    }, [currRoom.roomId])

    return (
        <>
            <RoomBanner
                toggleRoomInfoSidebar={toggleRoomInfoSidebar}
                room={currRoom}
                searchContainerRef={messageContainer}
                users={users}
            />

            {status === 'loading' || (hasNextPage && isFetchingNextPage) ? (
                <CircularProgress sx={{ justifySelf: 'center', position: 'absolute', zIndex: 99, top: '10%' }} />
            ) : null}

            <Box ref={messageContainer}>
                {messages.length >= 1 ? (
                    <Virtuoso
                        ref={virtuosoRef}
                        data={messages?.filter(msg => msg.roomId === currRoom.roomId)}
                        followOutput={'smooth'}
                        overscan={10}
                        firstItemIndex={firstItemIndex}
                        endReached={() => {
                            axiosServerInstance.put(Routes.put.lastReadMessage, {
                                lastReadMessageId: messages[messages.length - 1]?.key ?? messages.length,
                                roomId: currRoom.roomId,
                            })
                        }}
                        startReached={() => {
                            if (!hasNextPage) return
                            fetchNextPage()
                            setFirstItemIndex(p => (p - messageFetchCount < 0 ? 0 : p - messageFetchCount))
                        }}
                        initialTopMostItemIndex={{ behavior: 'auto', index: messages.length - 1 }}
                        itemContent={(i, message) => {
                            // TODO: figure out why this is happening. Could reveal some underlying bug
                            if (message.roomId !== currRoom.roomId)
                                throw new Error('Message from one from leaked into other room.')

                            return (
                                <MessageTile
                                    key={message.key}
                                    message={message}
                                    roomType={currRoom.roomType}
                                    users={users}
                                    messageDispatcher={messageDispatcher}
                                />
                            )
                        }}
                    />
                ) : null}
            </Box>

            {usersCurrentlyTyping !== null && usersCurrentlyTyping.length > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                    {usersCurrentlyTyping.join(', ') + ' typing'} <PulseLoader size={3} />
                </Box>
            ) : null}

            <ChatInputBar messageListDispatcher={messageDispatcher} currRoom={currRoom} />
            <ButtonGroup fullWidth variant='text'>
                <Button
                    onClick={() => {
                        // TODO: convert scroll behaviour to 'smooth'
                        if (virtuosoRef.current) virtuosoRef.current.scrollToIndex(0)
                    }}
                    startIcon={<ArrowUpwardRounded />}
                >
                    scroll to top
                </Button>
                <Button
                    onClick={() => {
                        if (virtuosoRef.current) virtuosoRef.current.scrollToIndex(messages.length - 1)
                    }}
                    endIcon={<ArrowDownwardRounded />}
                >
                    scroll to bottom
                </Button>
            </ButtonGroup>
        </>
    )
}
