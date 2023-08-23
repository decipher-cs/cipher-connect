import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Divider,
    Drawer,
    Fade,
    Menu,
    MenuItem,
    Paper,
    ToggleButton,
    Toolbar,
    Typography,
} from '@mui/material'
import { memo, useContext, useEffect, useRef } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { imageBufferToURLOrEmptyString, Message } from '../pages/Chat'
import SearchIcon from '@mui/icons-material/Search'
import {
    ArrowRight,
    AttachFileRounded,
    ChevronLeftRounded,
    ChevronRightRounded,
    FilePresentRounded,
    ImageRounded,
    MicRounded,
    MoreVertRounded,
    StartRounded,
    VideoCameraBackRounded,
} from '@mui/icons-material'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import { socket } from '../socket'
import { RoomInfo } from './RoomInfo'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'
import { MessageTile } from './MessageTile'
import { StyledTextField } from './StyledTextField'
import { useAudioRecorder } from '../hooks/useAudioRecorder'

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

    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

    const audioRecorder = useAudioRecorder()

    const addMessgeToMessageList = () => {
        const trimmedText = currInputText.slice().trim()
        if (trimmedText.length <= 0) return

        if (props.currRoom !== undefined) {
            socket.emit('privateMessage', props.currRoom.roomId, trimmedText)
        } else console.log('No room selected. This should not be possible.')

        setCurrInputText('')
    }

    const sendMessageContents = () => {}
    const sendAudioMessage = () => {}
    const detectFileType = () => {
        console.log('file is of type:')
    }

    return (
        <>
            {audioRecorder.recordedAudioFile !== undefined ? (
                <>
                    <audio src={URL.createObjectURL(audioRecorder.recordedAudioFile)} controls>
                        audio
                    </audio>
                </>
            ) : null}
            <StyledTextField
                sx={{
                    backgroundColor: 'white',
                    width: '80%',
                    justifySelf: 'center',
                    mb: 1,
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <IconButton
                                onClick={e => {
                                    addMessgeToMessageList()
                                    setMenuAnchor(e.currentTarget)
                                }}
                            >
                                {/* /TODO: add ability to attach files like images and pdf/ */}
                                <AttachFileRounded />
                            </IconButton>
                        </InputAdornment>
                    ),

                    endAdornment: (
                        <InputAdornment position='end'>
                            <ToggleButton
                                onClick={() => {
                                    if (audioRecorder.permissionsGranted !== true) {
                                        audioRecorder.getAudioRecodringPermissions()
                                        return
                                    }
                                    console.log('state:', audioRecorder.state)
                                    if (audioRecorder.state === 'inactive') {
                                        audioRecorder.recorder?.start()
                                    } else if (audioRecorder.state === 'recording') {
                                        audioRecorder.recorder?.stop()
                                    } else {
                                        console.log('report to dev: uncaught audio')
                                    }
                                }}
                                // selected={audioRecorder.state === 'recording'}
                                value='audio recording'
                                color='primary'
                            >
                                <MicRounded />
                            </ToggleButton>
                            <IconButton onClick={addMessgeToMessageList}>
                                <ArrowRight />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                value={currInputText}
                fullWidth
                placeholder='Type A Message...'
                onChange={e => setCurrInputText(e.target.value)}
                onKeyDown={e => (e.key === 'Enter' ? addMessgeToMessageList() : null)}
            />
            <AddAttachmentMenu anchorEl={menuAnchor} setAnchorEl={setMenuAnchor} />
        </>
    )
}

const AddAttachmentMenu = (props: {
    anchorEl: HTMLElement | null
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>
}) => {
    const open = Boolean(props.anchorEl)

    const handleClose = () => {
        props.setAnchorEl(null)
    }
    return (
        <Menu open={open} onClose={handleClose} TransitionComponent={Fade} anchorEl={props.anchorEl}>
            <MenuItem onClick={handleClose}>
                <IconButton>
                    <VideoCameraBackRounded />
                </IconButton>
            </MenuItem>
            <MenuItem onClick={handleClose}>
                <IconButton>
                    <ImageRounded />
                </IconButton>
            </MenuItem>
            <MenuItem onClick={handleClose}>
                <IconButton>
                    <FilePresentRounded />
                </IconButton>
            </MenuItem>
        </Menu>
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
                webkitBackdropFilter: 'blur(20px)',

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
                    <StyledTextField size='small' />
                </Collapse>

                <IconButton onClick={() => props.setRoomInfoVisible(prev => !prev)}>
                    <ChevronRightRounded />
                </IconButton>
            </ButtonGroup>
        </Box>
    )
}

export default ChatDisplaySection
