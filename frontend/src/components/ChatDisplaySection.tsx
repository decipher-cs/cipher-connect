import { Button, Paper, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { memo, useContext, useEffect, useRef } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { Message } from '../pages/Chat'

import { ArrowRight } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import { generateDummyMessage } from '../pages/Chat'
import { socket } from '../socket'

export interface ChatDisplaySectionProps {
    chatMessageList: Message[]
    fakeScrollDiv: React.MutableRefObject<HTMLDivElement | null>

    setChatMessageList: React.Dispatch<React.SetStateAction<Message[]>>
    currRoom: string | undefined
}

const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    const scrollToBottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollToBottomRef.current === null) return
        scrollToBottomRef.current.scrollIntoView(true)
    }, [props.chatMessageList])

    return (
        <>
            <Container
                ref={props.fakeScrollDiv}
                sx={{
                    maxWidth: '90vw',
                    height: '50vh',
                    overflow: 'scroll',
                    p: 2,
                    backgroundColor: 'grey',
                    gap: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {props.chatMessageList.map((message, i) => {
                    return (
                        <SingleTextMessage
                            key={i}
                            message={message}
                            // If newest message in the list, put ref on it
                            endRef={i === props.chatMessageList.length - 1 ? scrollToBottomRef : null}
                        />
                    )
                })}
                <div ref={scrollToBottomRef} style={{ display: 'none' }}></div>
            </Container>

            <ChatInputBar setChatMessageList={props.setChatMessageList} currRoom={props.currRoom} />
        </>
    )
}

interface ChatInputBarProps {
    setChatMessageList: React.Dispatch<React.SetStateAction<Message[]>>
    currRoom: string | undefined
}

export const ChatInputBar = (props: ChatInputBarProps) => {
    const [currInputText, setCurrInputText] = useState('')

    const addMessgeToMessageList = () => {
        const trimmedText = currInputText.slice().trim()
        if (trimmedText.length <= 0) return

        if (props.currRoom !== undefined) {
            socket.emit('privateMessage', props.currRoom, trimmedText)
        } else console.log('No room selected. This should not be possible.')

        setCurrInputText('')
    }

    return (
        <>
            <TextField
                sx={{ mt: 10 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton onClick={addMessgeToMessageList}>
                                <ArrowRight />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                value={currInputText}
                fullWidth
                placeholder='Enter Message'
                onChange={e => setCurrInputText(e.target.value)}
                onKeyDown={e => (e.key === 'Enter' ? addMessgeToMessageList() : null)}
            />
        </>
    )
}

interface SingleTextMessageProps {
    message: Message
    endRef: React.RefObject<HTMLDivElement> | null
}

const SingleTextMessage = memo((props: SingleTextMessageProps) => {
    const { username } = useContext(CredentialContext)

    return (
        <Paper
            sx={{
                width: 'fit-content',
                p: 1.5,
                placeSelf: props.message.senderUsername === username ? 'flex-end' : 'flex-start',
            }}
            ref={props.endRef}
        >
            <Typography>{props.message.content}</Typography>
        </Paper>
    )
})

export default ChatDisplaySection
