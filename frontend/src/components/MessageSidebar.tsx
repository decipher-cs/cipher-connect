import {
    Avatar,
    Box,
    Checkbox,
    Collapse,
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
import { Buffers } from '@react-frontend-developer/buffers'
import { imageBufferToURLOrEmptyString } from '../pages/Chat'
import { BorderColorRounded } from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'

interface MessageSidebarProps {
    rooms: RoomWithParticipants[]
    socketObject: SocketWithCustomEvents
    setSelectedRoomIndex: React.Dispatch<React.SetStateAction<number | undefined>>
    selectedRoomIndex: number | undefined
}

export const MessageSidebar = (props: MessageSidebarProps) => {
    const { username } = useContext(CredentialContext)

    const [contactFieldValue, setContactFieldValue] = useState('')

    const [contactFieldHelperText, setContactFieldHelperText] = useState('')

    const [createGroupFieldValue, setCreateGroupFieldValue] = useState('')

    const [createGroupFieldHelperText, setCreateGroupFieldHelperText] = useState('')

    const [showTextFields, setShowTextFields] = useState(false)

    return (
        <Box
            sx={{
                flexBasis: '20%',
                flexShrink: 0,
                flexGrow: 0,

                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                alignContent: 'flex-start',
                // justifyItems: 'stretch'
                // justifyContent: 'stretch'
            }}
        >
            <Typography display={'inline'}>Messages</Typography>
            <Checkbox
                icon={<BorderColorRounded />}
                checkedIcon={<BorderColorRounded />}
                onClick={() => {
                    setShowTextFields(prev => !prev)
                }}
                sx={{ ml: 'auto' }}
            />

            <Collapse in={showTextFields}>
                <Divider sx={{ my: 2 }} />
                <StyledTextField
                    size='small'
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

                <Typography align='center' variant='body2'>
                    OR
                </Typography>

                <StyledTextField
                    size='small'
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
                <Divider sx={{ my: 2 }} />
            </Collapse>
            <List sx={{ flexGrow: 1, flexShrink: 0 }}>
                {props.rooms.map((room, i) => {
                    return (
                        <div key={i}>
                            {i === 0 ? null : <Divider component='li' />}
                            <MessageListItem
                                roomIndex={i}
                                selectedRoomIndex={props.selectedRoomIndex}
                                room={room}
                                socketObject={props.socketObject}
                                username={username}
                                setSelectedRoomIndex={props.setSelectedRoomIndex}
                            />
                        </div>
                    )
                })}
            </List>
        </Box>
    )
}

interface MessageListItemProps {
    socketObject: SocketWithCustomEvents
    room: RoomWithParticipants
    username: string
    setSelectedRoomIndex: React.Dispatch<React.SetStateAction<number | undefined>>
    selectedRoomIndex: number | undefined
    roomIndex: number
}

const MessageListItem = (props: MessageListItemProps) => {
    let displayName = ''
    let displayImage = ''
    let participantUsername = ''
    const roomType = props.room.isMaxCapacityTwo === true ? 'private' : 'group'

    if (roomType === 'private') {
        const participantDetails = props.room.participants.find(p => p.username !== props.username)

        const displayImageBuffer = participantDetails?.userDisplayImage ?? null

        displayName = participantDetails?.username ?? ''

        participantUsername = participantDetails?.userDisplayName ?? ''

        displayImage = imageBufferToURLOrEmptyString(displayImageBuffer)
    } else if (roomType === 'group') {
        displayName = props.room.roomDisplayName

        displayImage = imageBufferToURLOrEmptyString(props.room.roomDisplayImage)
    }

    return (
        <ListItemButton
            onClick={() => {
                props.socketObject.emit('roomSelected', props.room.roomId)
                props.socketObject.emit('messagesRequested', props.room.roomId)
                props.setSelectedRoomIndex(props.roomIndex)
            }}
            selected={props.selectedRoomIndex === props.roomIndex}
        >
            <ListItem disableGutters disablePadding>
                <ListItemIcon>
                    <Avatar src={displayImage} />
                </ListItemIcon>

                {roomType === 'private' ? (
                    <ListItemText primary={<>{displayName}</>} secondary={<>{participantUsername}</>} />
                ) : (
                    <ListItemText primary={<>{displayName}</>} secondary={<>{'Group'}</>} />
                )}
            </ListItem>
        </ListItemButton>
    )
}
