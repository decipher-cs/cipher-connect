import { Avatar, TextField, Box, Icon, Typography, IconButton, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'
import { useState } from 'react'
import { imageBufferToURLOrEmptyString } from '../pages/Chat'

interface RoomInfoProps {
    rooms: RoomWithParticipants[]
    selectedRoomIndex: number | undefined
    socketObject: SocketWithCustomEvents
}

export const RoomInfo = (props: RoomInfoProps) => {
    const [contactFieldValue, setContactFieldValue] = useState('password')

    const [contactFieldHelperText, setContactFieldHelperText] = useState('')

    if (props.selectedRoomIndex === undefined) return <>Select a room</>

    const room = props.rooms[props.selectedRoomIndex]

    const roomType = room.isMaxCapacityTwo === true ? 'private' : 'group'

    const roomAvatar = imageBufferToURLOrEmptyString(room.roomDisplayImage)

    return (
        // TODO: Make this a drawer or slider to toggle it.
        <Box
            sx={{
                border: 'solid blue 3px',
                flexBasis: '25%',
            }}
        >
            {/* Group Image */}
            <Avatar src={roomAvatar} />
            <Typography variant='h6'>{props.rooms[props.selectedRoomIndex].roomDisplayName}</Typography>
            {props.rooms[props.selectedRoomIndex].participants.length} members
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
                            if (e.key === 'Enter' && props.selectedRoomIndex !== undefined)
                                props.socketObject.emit(
                                    'addParticipantsToGroup',
                                    [contactFieldValue],
                                    props.rooms[props.selectedRoomIndex].roomId,
                                    response => {
                                        console.log(response)
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
            {props.rooms[props.selectedRoomIndex].participants.map(({ username }, i) => (
                <div key={i}>{username}</div>
            ))}
            {props.rooms[props.selectedRoomIndex].isMaxCapacityTwo === false ? (
                <>
                    <Button onClick={() => {}}>Delete Group</Button>
                    <Button onClick={() => {}}>Leave Group</Button>
                </>
            ) : null}
        </Box>
    )
}
