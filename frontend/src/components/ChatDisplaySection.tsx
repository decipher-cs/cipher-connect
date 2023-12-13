import { Box, Button, CircularProgress, Container } from '@mui/material'
import { createRef, useContext, useEffect, useReducer, useRef } from 'react'
import React, { useState } from 'react'
import { MessageContentType, RoomWithParticipants, ServerMessage, User } from '../types/prisma.client'
import { MessageTile } from './MessageTile'
import { ChatInputBar } from './ChatInputBar'
import { RoomBanner } from './RoomBanner'
import { Message } from '../types/prisma.client'
import { MessageListAction, MessageListActionType, messageListReducer } from '../reducer/messageListReducer'
import { Routes } from '../types/routes'
import { SocketWithCustomEvents, TypingStatus } from '../types/socket'
import { RoomsState } from '../reducer/roomReducer'
import { useSocket } from '../hooks/useSocket'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { axiosServerInstance } from '../App'
import { PulseLoader } from 'react-spinners'
import { AudioPlayer } from './AudioPlayer'
import Mark from 'mark.js'
import { useAuth } from '../hooks/useAuth'

export interface ChatDisplaySectionProps {
    currRoom: RoomsState['joinedRooms'][0]
    toggleRoomInfoSidebar: () => void
}

export const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    const {
        authStatus: { username },
    } = useAuth()

    const scrollToBottomRef = useRef<HTMLDivElement>(null)

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
        queryKey: ['messages', props.currRoom.roomId],
        queryFn: ({ pageParam }) =>
            axiosServerInstance
                .get<ServerMessage[]>(
                    Routes.get.messages +
                        `/${props.currRoom.roomId}?messageQuantity=10&${pageParam ? 'cursor=' + pageParam : ''}`
                )
                .then((res): Message[] => res.data.map(msg => ({ ...msg, deliveryStatus: 'delivered' }))),

        getNextPageParam: (lastPage, _) => lastPage.at(-1)?.key,
    })

    useEffect(() => {
        if (!serverMessages) return
        messageDispatcher({
            type: MessageListActionType.initializeMessages,
            newMessages: serverMessages.pages.flat().reverse(),
        })
    }, [serverMessages?.pages, serverMessages?.pageParams])

    const [usersCurrentlyTyping, setUsersCurrentlyTyping] = useState<User['username'][] | null>(null)

    useEffect(() => {
        if (scrollToBottomRef.current === null) return
        scrollToBottomRef.current.scrollIntoView(true)
    // }, [])
    }, [messages])

    useEffect(() => {
        socket.on('typingStatusChanged', (status, roomId, username) => {
            if (roomId !== props.currRoom.roomId) return
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
    }, [usersCurrentlyTyping, props.currRoom.roomId])

    useEffect(() => {
        socket.on('messageDeleted', (messageKey, roomId) => {
            if (props.currRoom.roomId === roomId) {
                messageDispatcher({ type: MessageListActionType.remove, messageKey })
            }
        })

        return () => {
            socket.removeListener('messageDeleted')
        }
    }, [props.currRoom.roomId])

    useEffect(() => {
        socket.on('message', (messageFromServer, callback) => {
            if (messageFromServer.roomId === props.currRoom.roomId) {
                messageDispatcher({
                    type: MessageListActionType.add,
                    newMessage: { ...messageFromServer, deliveryStatus: 'delivered' },
                })
            }
            callback('ok')
        })

        return () => {
            socket.removeListener('message')
        }
    }, [props.currRoom.roomId])

    useEffect(() => {
        socket.on('textMessageUpdated', (key, content, roomId, editedAt) => {
            if (roomId === props.currRoom.roomId) {
                messageDispatcher({ type: MessageListActionType.edit, updatedMessage: { content, key, editedAt } })
            }
        })

        return () => {
            socket.removeListener('textMessageUpdated')
        }
    }, [props.currRoom.roomId])

    return (
        <>
            <RoomBanner
                toggleRoomInfoSidebar={props.toggleRoomInfoSidebar}
                room={props.currRoom}
                searchContainerRef={messageContainer}
            />
            <Box
                ref={messageContainer}
                sx={{
                    display: 'grid',
                    alignContent: 'flex-start',
                    width: '100%',

                    overflowY: 'scroll',
                    px: 2,
                    gap: 3,
                    pt: 10,
                    pb: 2,
                }}
            >
                {hasNextPage && isFetchingNextPage ? <CircularProgress sx={{ justifySelf: 'center' }} /> : null}
                {messages.map((message, i) => {
                    if (message.roomId !== props.currRoom.roomId) return

                    return (
                        <MessageTile
                            key={message.key}
                            message={message}
                            roomType={props.currRoom.roomType}
                            user={
                                props.currRoom.participants.filter(
                                    ({ username }) => username === message.senderUsername
                                )[0]
                            }
                            indexInList={i}
                            // If newest message in the list, put ref on it to auto-scroll to bottom
                            //
                            autoScrollToBottomRef={i === messages.length - 1 ? scrollToBottomRef : null}
                            handleScrollToTop={() => {
                                if (hasNextPage && !isFetchingNextPage) fetchNextPage()
                            }}
                        />
                    )
                })}
            </Box>
            {usersCurrentlyTyping !== null && usersCurrentlyTyping.length > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                    {usersCurrentlyTyping.join(', ') + ' typing'} <PulseLoader size={3} />
                </Box>
            ) : null}

            <ChatInputBar messageListDispatcher={messageDispatcher} currRoom={props.currRoom} />
        </>
    )
}
