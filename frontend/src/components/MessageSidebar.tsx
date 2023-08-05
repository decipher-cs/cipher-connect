import {
    Avatar,
    Box,
    Divider,
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
    socketObject: SocketWithCustomEvents
    room: RoomWithParticipants
    username: string
    // setSelectedRoomIndex: React.Dispatch<React.SetStateAction<number | undefined>>
}

const MessageListItem = (props: MessageListItemProps) => {
    let displayName: string
    let displayImage: string

    // check if it's a private room or a group
    if (props.room.isMaxCapacityTwo === true) {
        displayName = props.room.participants.find(p => p.username !== props.username)?.username ?? 'ERR:NO_NAME'
    } else displayName = props.room.roomDisplayName

    if (props.room.roomDisplayImage !== null) {
        const imgBuffer = props.room.roomDisplayImage as ArrayBuffer
        const imageFile = new File([imgBuffer], 'roomAvatar')
        displayImage = URL.createObjectURL(imageFile)
    } else displayImage = ''

    return (
        <ListItem disableGutters disablePadding>
            <ListItemButton
                onClick={() => {
                    props.socketObject.emit('roomSelected', props.room.roomId)
                    //
                    // const roomIndex = props.rooms.findIndex(r => r.roomId === props.roomId)
                    // props.setSelectedRoomIndex(roomIndex !== -1 ? roomIndex : undefined)

                    props.socketObject.emit('messagesRequested', props.room.roomId)
                }}
            >
                <ListItemIcon>
                    <Avatar src={displayImage} />
                </ListItemIcon>
                <ListItemText primary={<>{displayName}</>} secondary={<>subtext</>} />
            </ListItemButton>
        </ListItem>
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
                    return (
                        <MessageListItem
                            key={i}
                            room={room}
                            socketObject={props.socketObject}
                            username={username}
                            // setSelectedRoomIndex={}
                        />
                    )
                })}
            </List>
        </Box>
    )
}
