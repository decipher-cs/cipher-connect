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
                    // flexGrow: 1,
                    // height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'scroll',
                    // alignItems: 'center'
                    // maxHeight: '100%',
                    px: 2,
                    gap: 1.8,
                    pt: 12,
                    // display: 'grid',
                    // placeContent: 'center',
                    // placeItems: 'center',
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
        <Paper
            square
            elevation={0}
            variant='outlined'
            sx={{
                position: 'absolute',
                left: '0px',
                right: '0px',

                // From https://css.glass //
                background: 'rgba(255, 255, 255, 0.19)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(18.4px)',
                WebkitBackdropFilter: 'blur(18.4px)',
            }}
        >
            <Toolbar>
                <IconButton
                    onClick={() => {
                        // TODO: view the display image full screen
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
