import { Box } from '@mui/material'
import { useContext, useEffect, useRef } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import React, { useState } from 'react'
import { RoomWithParticipants, User } from '../types/prisma.client'
import { MessageTile } from './MessageTile'
import { ChatInputBar } from './ChatInputBar'
import { RoomBanner } from './RoomBanner'
import { Message } from '../types/prisma.client'
import { MessageListAction, MessageListActionType } from '../reducer/messageListReducer'
import { Routes } from '../types/routes'
import { SocketWithCustomEvents, TypingStatus } from '../types/socket'
import { RoomsState } from '../reducer/roomReducer'
import { useSocket } from '../hooks/useSocket'

export interface ChatDisplaySectionProps {
    chatMessageList: Message[]
    currRoom: RoomsState['joinedRooms'][0]
    setRoomInfoVisible: React.Dispatch<React.SetStateAction<boolean>>
    messageListDispatcher: React.Dispatch<MessageListAction>
}

export const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    const { username } = useContext(CredentialContext)

    const scrollToBottomRef = useRef<HTMLDivElement>(null)

    // TODO: cache this using usecallback or useMemo
    const chatMessageList = props.chatMessageList.slice().sort((a, b) => {
        const aInMilliseconds = new Date(a.createdAt).valueOf()
        const bInMilliseconds = new Date(b.createdAt).valueOf()
        return aInMilliseconds - bInMilliseconds
    })

    const socket = useSocket()

    const [usersCurrentlyTyping, setUsersCurrentlyTyping] = useState<User['username'][] | null>(null)

    useEffect(() => {
        if (scrollToBottomRef.current === null) return
        scrollToBottomRef.current.scrollIntoView(true)
    }, [props.chatMessageList])

    useEffect(() => {
        socket.on('typingStatusChanged', (status, roomId, username) => {
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
    }, [usersCurrentlyTyping])

    return (
        <>
            <RoomBanner setRoomInfoVisible={props.setRoomInfoVisible} room={props.currRoom} />
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
                {chatMessageList.map((message, i) => {
                    return (
                        <MessageTile
                            key={i}
                            alignment={message.senderUsername === username ? 'right' : 'left'}
                            content={message.content}
                            // If newest message in the list, put ref on it to auto-scroll to bottom
                            autoScrollToBottomRef={i === props.chatMessageList.length - 1 ? scrollToBottomRef : null}
                            contentType={message.contentType}
                            // MIME={message.MIME}
                        />
                    )
                })}
            </Box>
            {usersCurrentlyTyping !== null && usersCurrentlyTyping.length > 0
                ? usersCurrentlyTyping.join(', ') + ' typing...'
                : null}
            <ChatInputBar messageListDispatcher={props.messageListDispatcher} currRoom={props.currRoom} />
        </>
    )
}
