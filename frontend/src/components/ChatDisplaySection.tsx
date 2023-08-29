import { Avatar, Box, ButtonGroup, Collapse, Typography } from '@mui/material'
import { memo, useContext, useEffect, useRef } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { imageBufferToURLOrEmptyString } from '../pages/Chat'
import React, { useState } from 'react'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'
import { MessageTile } from './MessageTile'
import { ChatInputBar } from './ChatInputBar'
import { RoomBanner } from './RoomBanner'
import { Message } from '../types/prisma.client'

export interface ChatDisplaySectionProps {
    chatMessageList: Message[]
    setChatMessageList: React.Dispatch<React.SetStateAction<Message[]>>
    currRoom: RoomWithParticipants
    socketObject: SocketWithCustomEvents
    setRoomInfoVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    const { username } = useContext(CredentialContext)

    const scrollToBottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollToBottomRef.current === null) return
        scrollToBottomRef.current.scrollIntoView(true)
    }, [props.chatMessageList])

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
                {props.chatMessageList.map((message, i) => {
                    return (
                        <MessageTile
                            key={i}
                            alignment={message.senderUsername === username ? 'right' : 'left'}
                            content={message.content}
                            // If newest message in the list, put ref on it to auto-scroll to bottom
                            autoScrollToBottomRef={i === props.chatMessageList.length - 1 ? scrollToBottomRef : null}
                            messageContentType={message.contentType}
                        />
                    )
                })}
            </Box>

            <ChatInputBar
                setChatMessageList={props.setChatMessageList}
                currRoom={props.currRoom}
                socketObject={props.socketObject}
            />
        </>
    )
}
