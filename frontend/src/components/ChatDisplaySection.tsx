import { Avatar, Box, Button, ButtonGroup, Collapse, Drawer, Paper, Toolbar, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { memo, useContext, useEffect, useRef } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { imageBufferToURLOrEmptyString, Message } from '../pages/Chat'
import SearchIcon from '@mui/icons-material/Search'
import { ArrowRight, MoreVertRounded } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import { socket } from '../socket'
import { RoomInfo } from './RoomInfo'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'

export interface ChatDisplaySectionProps {
    chatMessageList: Message[]
    setChatMessageList: React.Dispatch<React.SetStateAction<Message[]>>
    currRoom: RoomWithParticipants
    socketObject: SocketWithCustomEvents
}

const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    const scrollToBottomRef = useRef<HTMLDivElement>(null)

    const [roomInfoVisible, setRoomInfoVisible] = useState(true)

    useEffect(() => {
        if (scrollToBottomRef.current === null) return
        scrollToBottomRef.current.scrollIntoView(true)
    }, [props.chatMessageList])

    return (
        <Box
            sx={{
                display: 'flex',
                flexGrow: 1,
                height: '100vh',
            }}
        >
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(45deg, #e1eec3, #f05053)',
                }}
            >
                <RoomBanner setRoomInfoVisible={setRoomInfoVisible} room={props.currRoom} />

                <Container
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'scroll',
                        p: 2,
                        gap: 2,
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
                </Container>
                <ChatInputBar setChatMessageList={props.setChatMessageList} currRoom={props.currRoom} />
            </Box>

            <Collapse in={roomInfoVisible} orientation='horizontal'>
                <RoomInfo socketObject={props.socketObject} room={props.currRoom} />
            </Collapse>
        </Box>
    )
}

interface ChatInputBarProps {
    setChatMessageList: React.Dispatch<React.SetStateAction<Message[]>>
    currRoom: RoomWithParticipants
}

export const ChatInputBar = (props: ChatInputBarProps) => {
    const [currInputText, setCurrInputText] = useState('')

    const addMessgeToMessageList = () => {
        const trimmedText = currInputText.slice().trim()
        if (trimmedText.length <= 0) return

        if (props.currRoom !== undefined) {
            socket.emit('privateMessage', props.currRoom.roomId, trimmedText)
        } else console.log('No room selected. This should not be possible.')

        setCurrInputText('')
    }

    return (
        <>
            <TextField
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
                maxWidth: '90%',
                p: 1.5,
                placeSelf: props.message.senderUsername === username ? 'flex-end' : 'flex-start',
            }}
            ref={props.endRef}
        >
            <Typography paragraph>{props.message.content}</Typography>
        </Paper>
    )
})

const RoomBanner = (props: {
    setRoomInfoVisible: React.Dispatch<React.SetStateAction<boolean>>
    room: RoomWithParticipants
}) => {
    const [searchFieldVisible, setSearchFieldVisible] = useState(false)

    return (
        // {/* <Paper square elevation={0} variant='outlined' sx={{position: 'absolute', width: 'fit-content', right: '0px', backgroundColor: 'red' }}> */}
        <Paper square elevation={0} variant='outlined'>
            <Toolbar>
                <IconButton
                    onClick={() => {
                        props.setRoomInfoVisible(prev => !prev)
                    }}
                >
                    <Avatar src={imageBufferToURLOrEmptyString(props.room.roomDisplayImage)} />
                </IconButton>
                <Typography>{props.room.roomDisplayName}</Typography>
                <ButtonGroup>
                    <IconButton onClick={() => setSearchFieldVisible(p => !p)}>
                        <SearchIcon />
                    </IconButton>
                    <Collapse in={searchFieldVisible} orientation='horizontal'>
                        <TextField />
                    </Collapse>

                    <IconButton
                        onClick={() => {
                            props.setRoomInfoVisible(prev => !prev)
                        }}
                    >
                        <MoreVertRounded />
                    </IconButton>
                </ButtonGroup>
            </Toolbar>
        </Paper>
    )
}

export default ChatDisplaySection
