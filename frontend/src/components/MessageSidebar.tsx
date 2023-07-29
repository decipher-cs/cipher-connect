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
import { useContext, useState } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import AddIcon from '@mui/icons-material/Add'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'

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
    setSelectedRoomIndex: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const MessageSidebar = (props: MessageSidebarProps) => {
    const { username } = useContext(CredentialContext)
    const [contactFieldValue, setContactFieldValue] = useState('')
    const [contactFieldHelperText, setContactFieldHelperText] = useState('')
    const [createGroupFieldValue, setCreateGroupFieldValue] = useState('')
    const [createGroupFieldHelperText, setCreateGroupFieldHelperText] = useState('')
    return (
        <Box
            sx={{
                border: 'solid red 3px',
                flexBasis: '20%',
            }}
        >
            <Typography>Messages</Typography>
            <IconButton>
                <AddIcon />
            </IconButton>
            {/* Hide textField or Make it collapse */}
            <TextField
                onChange={e => {
                    setContactFieldValue(e.target.value)
                    if (contactFieldHelperText !== '') setContactFieldHelperText('')
                }}
                onKeyDown={e => {
                    if (e.key === 'Enter')
                        props.socketObject.emit('createNewPrivateRoom', contactFieldValue, response => {
                            console.log(response)
                            setContactFieldHelperText(response)
                        })
                }}
                value={contactFieldValue}
                helperText={contactFieldHelperText}
                placeholder='Add contact'
            />
            <TextField
                onChange={e => {
                    setCreateGroupFieldValue(e.target.value)
                    if (createGroupFieldHelperText !== '') setCreateGroupFieldHelperText('')
                }}
                onKeyDown={e => {
                    if (e.key === 'Enter')
                        props.socketObject.emit('createNewGroup', [username], createGroupFieldValue, response => {
                            console.log(response)
                            setCreateGroupFieldValue(response)
                        })
                }}
                value={createGroupFieldValue}
                helperText={createGroupFieldHelperText}
                placeholder='Create group'
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

                                    const roomIndex = props.rooms.findIndex(r => r.roomId === room.roomId)
                                    props.setSelectedRoomIndex(roomIndex !== -1 ? roomIndex : undefined)

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
