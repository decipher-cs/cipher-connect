import {
    Avatar,
    TextField,
    Box,
    Icon,
    Typography,
    IconButton,
    Button,
    Drawer,
    InputAdornment,
    Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'
import { ForwardedRef, forwardRef, Ref, useState } from 'react'
import { imageBufferToURLOrEmptyString } from '../pages/Chat'
import { ArrowForwardRounded, SearchSharp } from '@mui/icons-material'

interface RoomInfoProps {
    room: RoomWithParticipants
    socketObject: SocketWithCustomEvents
    style?: any
}

export const RoomInfo = (props: RoomInfoProps) => {
    const [contactFieldValue, setContactFieldValue] = useState('password')

    const [contactFieldHelperText, setContactFieldHelperText] = useState('')

    const roomType = props.room.isMaxCapacityTwo === true ? 'private' : 'group'

    const [roomAvatar, setRoomAvatar] = useState(imageBufferToURLOrEmptyString(props.room.roomDisplayImage))

    const [roomName, setRoomName] = useState(props.room.roomDisplayName)

    const [roomNameHelperText, setRoomNameHelperText] = useState('')

    const handleRoomNameChange = () => {}
    const handleRoomNameSubmit = () => {}

    const handleImageUpload = async (fileList: FileList | null) => {
        if (fileList === null || fileList.length === 0) return
        const URL = import.meta.env.PROD ? import.meta.env.VITE_SERVER_PROD_URL : import.meta.env.VITE_SERVER_DEV_URL

        const image = fileList[0]
        const imageFormData = new FormData()
        imageFormData.append('avatar', image)
        imageFormData.append('roomId', props.room.roomId)

        const res = await fetch(`${URL}/updateGroupImage`, {
            method: 'POST',
            body: imageFormData,
            credentials: 'include',
            headers: {
                Accept: 'multipart/form-data',
            },
        })
        if (res.statusText.toLowerCase() === 'ok') {
            const blob = await res.blob()
            const file = new File([blob], 'avatar')
            setRoomAvatar(imageBufferToURLOrEmptyString(file))
        }
    }

    return (
        <Box
            sx={{
                width: 'max-content',
                maxWidth: '400px',
                height: '100%',

                display: 'grid',
                px: 3,
                justifyItems: 'center',

                overflow: 'scroll',
            }}
        >
            <IconButton component='label' sx={{ justifySelf: 'center' }}>
                <Avatar src={roomAvatar} sx={{ height: 124, width: 124 }} />

                <input
                    type='file'
                    accept='image/*'
                    hidden
                    onChange={e => {
                        handleImageUpload(e.target.files)
                    }}
                />
            </IconButton>
            <TextField
                value={roomName}
                variant='standard'
                label='Room Name'
                helperText={roomNameHelperText}
                onChange={e => {
                    setRoomName(e.target.value)
                    if (e.target.value.trim() !== props.room.roomDisplayName) {
                        setRoomNameHelperText('Submit to change room name')
                    } else setRoomNameHelperText('')
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton onClick={() => {}}>
                                <ArrowForwardRounded />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            members ({props.room.participants.length})
            {roomType === 'group' && (
                <>
                    <IconButton>
                        <AddIcon />
                    </IconButton>
                    <TextField
                        onChange={e => {
                            setContactFieldValue(e.target.value)
                            if (contactFieldHelperText !== '') setContactFieldHelperText('')
                        }}
                        onKeyDown={e => {
                            if (e.key === 'Enter')
                                props.socketObject.emit(
                                    'addParticipantsToGroup',
                                    [contactFieldValue],
                                    props.room.roomId,
                                    response => {
                                        setContactFieldHelperText(response)
                                    }
                                )
                        }}
                        value={contactFieldValue}
                        helperText={contactFieldHelperText}
                        placeholder='Add contact'
                    />
                </>
            )}
            <Box>
                <Divider />
                {props.room.participants.map(({ username }, i) => (
                    <div key={i}>{username}</div>
                ))}
                <Divider />
            </Box>
            {props.room.isMaxCapacityTwo === false ? (
                <>
                    <Button onClick={() => {}}>Delete Group</Button>
                    <Button onClick={() => {}}>Leave Group</Button>
                </>
            ) : null}
        </Box>
    )
}
