import { Box } from '@mui/material'
import { useContext, useEffect, useReducer, useRef } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import React, { useState } from 'react'
import { RoomWithParticipants, User } from '../types/prisma.client'
import { MessageTile } from './MessageTile'
import { ChatInputBar } from './ChatInputBar'
import { RoomBanner } from './RoomBanner'
import { Message } from '../types/prisma.client'
import { MessageListAction, MessageListActionType, messageListReducer } from '../reducer/messageListReducer'
import { Routes } from '../types/routes'
import { SocketWithCustomEvents, TypingStatus } from '../types/socket'
import { RoomsState } from '../reducer/roomReducer'
import { useSocket } from '../hooks/useSocket'
import { useQuery } from '@tanstack/react-query'
import { axiosServerInstance } from '../App'
import { PulseLoader } from 'react-spinners'

export interface ChatDisplaySectionProps {
    currRoom: RoomsState['joinedRooms'][0]
    toggleRoomInfoSidebar: () => void
}

export const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    const { username } = useContext(CredentialContext)

    const scrollToBottomRef = useRef<HTMLDivElement>(null)

    const { data: serverMessages } = useQuery({
        queryKey: ['messages', props.currRoom.roomId],
        queryFn: () =>
            axiosServerInstance.get<Message[]>(Routes.get.messages + `/${props.currRoom.roomId}`).then(res => res.data),
    })

    const [messages, messageDispatcher] = useReducer(messageListReducer, [])

    useEffect(() => {
        if (serverMessages)
            messageDispatcher({ type: MessageListActionType.initializeMessages, newMessages: serverMessages })
    }, [serverMessages])

    // TODO: cache this using usecallback or useMemo
    const timeSortedMessages = messages.slice().sort((a, b) => {
        const aInMilliseconds = new Date(a.createdAt).valueOf()
        const bInMilliseconds = new Date(b.createdAt).valueOf()
        return aInMilliseconds - bInMilliseconds
    })

    const socket = useSocket()

    const [usersCurrentlyTyping, setUsersCurrentlyTyping] = useState<User['username'][] | null>(null)

    useEffect(() => {
        if (scrollToBottomRef.current === null) return
        scrollToBottomRef.current.scrollIntoView(true)
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
        socket.on('message', messageFromServer => {
            if (messageFromServer.roomId === props.currRoom.roomId) {
                messageDispatcher({ type: MessageListActionType.add, newMessage: messageFromServer })
            }
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
            <RoomBanner toggleRoomInfoSidebar={props.toggleRoomInfoSidebar} room={props.currRoom} />
            <Box
                sx={{
                    display: 'grid',
                    alignContent: 'flex-start',
                    gridTemplateColumns: '100%',

                    overflowY: 'scroll',
                    px: 2,
                    gap: 1.8,
                    pt: 10,
                    pb: 2,
                }}
            >
                {timeSortedMessages.map((message, i) => {
                    return (
                        <MessageTile
                            key={message.key}
                            sender={message.senderUsername}
                            messageKey={message.key}
                            roomId={message.roomId}
                            alignment={message.senderUsername === username ? 'right' : 'left'}
                            content={message.content}
                            // If newest message in the list, put ref on it to auto-scroll to bottom
                            autoScrollToBottomRef={i === messages.length - 1 ? scrollToBottomRef : null}
                            contentType={message.contentType}
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
