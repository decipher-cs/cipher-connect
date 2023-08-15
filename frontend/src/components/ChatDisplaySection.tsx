import { Avatar, Box, Button, ButtonGroup, Collapse, Drawer, Paper, Toolbar, Typography } from '@mui/material'
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
import { MessageTile } from './MessageTile'

export interface ChatDisplaySectionProps {
    chatMessageList: Message[]
    setChatMessageList: React.Dispatch<React.SetStateAction<Message[]>>
    currRoom: RoomWithParticipants
    socketObject: SocketWithCustomEvents
    setRoomInfoVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
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
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'scroll',
                    px: 2,
                    gap: 1.8,
                    pt: 12,
                    pb: 2,
                }}
            >
                {props.chatMessageList.map((message, i) => {
                    return (
                        <MessageTile
                            key={i}
                            alignment={message.senderUsername === username ? 'right' : 'left'}
                            textContent={message.content}
                            // If newest message in the list, put ref on it to auto-scroll to bottom
                            autoScrollToBottomRef={i === props.chatMessageList.length - 1 ? scrollToBottomRef : null}
                        />
                    )
                })}
            </Box>

            <ChatInputBar setChatMessageList={props.setChatMessageList} currRoom={props.currRoom} />
        </>
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
        <TextField
            sx={{
                backgroundColor: 'white',
            }}
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
    )
}

const RoomBanner = (props: {
    setRoomInfoVisible: React.Dispatch<React.SetStateAction<boolean>>
    room: RoomWithParticipants
}) => {
    const [searchFieldVisible, setSearchFieldVisible] = useState(false)

    return (
        // {/* <Paper square elevation={0} variant='outlined' sx={{position: 'absolute', width: 'fit-content', right: '0px', backgroundColor: 'red' }}> */}
        <Box
            // square
            // elevation={0}
            // variant='outlined'
            sx={{
                position: 'absolute',
                left: '0px',
                right: '0px',
                top: '0px',

                // From https://css.glass //
                background: 'rgba(255, 255, 255, 0.80)',
                backdropFilter: 'blur(10px)',
                '-webkit-backdrop-filter': 'blur(20px)',

                display: 'grid',
                gridTemplateColumns: 'repeat(2, auto) 1fr',
                alignItems: 'center',
                alignContent: 'center',
            }}
        >
            <IconButton href={imageBufferToURLOrEmptyString(props.room.roomDisplayImage)} target='_blank'>
                <Avatar src={imageBufferToURLOrEmptyString(props.room.roomDisplayImage)} />
            </IconButton>

            <Typography>{props.room.roomDisplayName}</Typography>

            <ButtonGroup sx={{ justifySelf: 'flex-end', alignItems: 'center' }}>
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
        </Box>
    )
}

export default ChatDisplaySection
