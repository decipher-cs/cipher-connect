import {
    Avatar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material'
import { room } from '../types/prisma.client'
import { RoomWithParticipants } from '../pages/Chat'
import { useContext, useState } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import AddIcon from '@mui/icons-material/Add'
import { SocketWithCustomEvents } from '../types/socket'

interface MessageListItemProps {
    rooms: RoomWithParticipants[]
}

const MessageListItem = () => {
    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <Avatar />
                </ListItemIcon>
                <ListItemText primary={<>name</>} secondary={<>subtext</>} />
            </ListItem>
        </>
    )
}

interface MessageSidebarProps {
    rooms: RoomWithParticipants[]
    socketObject: SocketWithCustomEvents
}

export const MessageSidebar = (props: MessageSidebarProps) => {
    const { username } = useContext(CredentialContext)
    const [value, setValue] = useState('')
    const [status, setStatus] = useState('')
    return (
        <Box
            sx={{
                border: 'solid red 3px',
                maxWidth: '30%',
            }}
        >
            <Typography>Messages</Typography>
            <IconButton>
                <AddIcon />
            </IconButton>
            {/* Hide textField or Make it collapse */}
            <TextField
                onChange={e => {
                    setValue(e.target.value)
                    if (status !== '') setStatus('')
                }}
                onKeyDown={e => {
                    if (e.key === 'Enter')
                        props.socketObject.emit('createNewPrivateRoom', value, response => {
                            console.log(response)
                            setStatus(response)
                        })
                }}
                value={value}
                helperText={status}
            />
            <List>
                {props.rooms.map((room, i) => {
                    // <MessageListItem key={i} />
                    let displayName
                    if (room.isMaxCapacityTwo === true) {
                        displayName = room.participants.find(
                            ({ username: participantUsername }) => participantUsername !== username
                        )?.username
                    } else {
                        displayName = room.roomDisplayName
                    }
                    return (
                        <ListItem key={i} disableGutters disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    props.socketObject.emit('roomSelected', room.roomId)
                                    props.socketObject.emit('messagesRequested', room.roomId)
                                }}
                            >
                                <ListItemIcon>
                                    <Avatar />
                                </ListItemIcon>
                                <ListItemText primary={<>{displayName}</>} secondary={<>subtext</>} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )
}
