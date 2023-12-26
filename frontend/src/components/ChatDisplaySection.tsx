import { Box, Button, ButtonGroup, CircularProgress, Container } from '@mui/material'
import { createRef, forwardRef, useContext, useEffect, useLayoutEffect, useReducer, useRef } from 'react'
import React, { useState } from 'react'
import { MessageContentType, RoomWithParticipants, ServerMessage, User } from '../types/prisma.client'
import { MessageTile } from './MessageTile'
import { ChatInputBar } from './ChatInputBar'
import { RoomBanner } from './RoomBanner'
import { Message } from '../types/prisma.client'
import { MessageListAction, MessageListActionType, messageListReducer } from '../reducer/messageListReducer'
import { Routes } from '../types/routes'
import { TypingStatus } from '../types/socket'
import { RoomsState } from '../reducer/roomReducer'
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
}

export const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    const { currRoom, users, toggleRoomInfoSidebar } = props

    const {
        authStatus: { username },
    } = useAuth()

    const messageContainer = useRef<HTMLDivElement>(null)

    const [messages, messageDispatcher] = useReducer(messageListReducer, [])

    const socket = useSocket()

    const {
        data: serverMessages,
        status,
        error,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['messages', currRoom.roomId],
        queryFn: ({ pageParam }) =>
            axiosServerInstance
                .get<ServerMessage[]>(
                    Routes.get.messages +
                        `/${currRoom.roomId}?messageQuantity=10&${pageParam ? 'cursor=' + pageParam : ''}`
                )
                .then(res => {
                    const result: Message[] = res.data.map(msg => ({ ...msg, deliveryStatus: 'delivered' }))
                    return result
                }),

        getNextPageParam: (lastPage, allPages) => {
            return lastPage.at(0)?.key
        },
    })

    useEffect(() => {
        if (!serverMessages?.pages?.at(-1)) return

        const messages = serverMessages.pages.slice().at(-1) ?? []

        messageDispatcher({
            type: MessageListActionType.prepend,
            newMessage: messages.reverse(),
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
        socket.on('message', messageFromServer => {
            if (messageFromServer.roomId === currRoom.roomId) {
                messageDispatcher({
                    type: MessageListActionType.add,
                    newMessage: { ...messageFromServer, deliveryStatus: 'delivered' },
                })
            }
        })

        return () => {
            socket.removeListener('message')
        }
    }, [currRoom.roomId])

    useEffect(() => {
        socket.on('textMessageUpdated', (key, content, roomId, editedAt) => {
            if (roomId === currRoom.roomId) {
                messageDispatcher({ type: MessageListActionType.edit, updatedMessage: { content, key, editedAt } })
            }
        })

        return () => {
            socket.removeListener('textMessageUpdated')
        }
    }, [currRoom.roomId])

    const virtuosoRef = useRef<VirtuosoHandle>(null)

    useEffect(() => {
        if (!virtuosoRef.current) return

        virtuosoRef.current.autoscrollToBottom()
    }, [])

    return (
        <>
            <RoomBanner
                toggleRoomInfoSidebar={toggleRoomInfoSidebar}
                room={currRoom}
                searchContainerRef={messageContainer}
                users={users}
            />

            {/* {hasNextPage && isFetchingNextPage ? <CircularProgress sx={{ justifySelf: 'center' }} /> : null} */}
            <Virtuoso
                ref={virtuosoRef}
                data={messages}
                overscan={20}
                atTopStateChange={() => (hasNextPage && !isFetchingNextPage ? fetchNextPage() : null)}
                itemContent={(i, message) => {
                    if (message.roomId !== currRoom.roomId)
                        throw new Error('Message from one from leaked into other room.')

                    return (
                        <MessageTile
                            key={message.key}
                            message={message}
                            roomType={currRoom.roomType}
                            users={users}
                            autoScrollToBottomRef={null}
                        />
                    )
                }}
            />

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
