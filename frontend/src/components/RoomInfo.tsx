import { Avatar, TextField, Box, Icon, Typography, IconButton, Button, Drawer } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'
import { useState } from 'react'
import { imageBufferToURLOrEmptyString } from '../pages/Chat'
import { SearchSharp } from '@mui/icons-material'

interface RoomInfoProps {
    room: RoomWithParticipants
    socketObject: SocketWithCustomEvents
}

export const RoomInfo = (props: RoomInfoProps) => {
    const [contactFieldValue, setContactFieldValue] = useState('password')

    const [contactFieldHelperText, setContactFieldHelperText] = useState('')

    const roomType = props.room.isMaxCapacityTwo === true ? 'private' : 'group'

    const [roomAvatar, setRoomAvatar] = useState(imageBufferToURLOrEmptyString(props.room.roomDisplayImage))

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
        <Box sx={{ p: 3, width: '300px', backgroundColor: 'red', display: 'grid' }}>
            <IconButton component='label' sx={{ justifySelf: 'center' }}>
                <Avatar src={roomAvatar} sx={{}} />

                <input
                    type='file'
                    accept='image/*'
                    hidden
                    onChange={e => {
                        handleImageUpload(e.target.files)
                    }}
                />
            </IconButton>
            <Typography variant='h6'>{props.room.roomDisplayName}</Typography>
            {props.room.participants.length} members
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
            {props.room.participants.map(({ username }, i) => (
                <div key={i}>{username}</div>
            ))}
            {props.room.isMaxCapacityTwo === false ? (
                <>
                    <Button onClick={() => {}}>Delete Group</Button>
                    <Button onClick={() => {}}>Leave Group</Button>
                </>
            ) : null}
        </Box>
    )
}
