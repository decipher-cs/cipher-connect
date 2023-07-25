import { Avatar,TextField, Box, Icon, Typography, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { RoomWithParticipants } from '../types/socket'
import { useState } from 'react'

interface RoomInfoProps {
    selectedRoom: RoomWithParticipants | undefined
    socketObject: SocketWithCustomEvents
}

export const RoomInfo = (props: RoomInfoProps) => {

    const [contactFieldValue, setContactFieldValue] = useState('')

    const [contactFieldHelperText, setContactFieldHelperText] = useState('')

    if (props.selectedRoom === undefined) return <>Select a room</>

    return (
        <Box
            sx={{
                border: 'solid blue 3px',
                maxWidth: '20%',
            }}
        >
            {/* Group Image */}
            <Avatar/>
            <Typography variant='h6'>
                {props.selectedRoom.roomDisplayName}
            </Typography>
                {props.selectedRoom.participants.length} members
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
                        props.socketObject.emit('createNewPrivateRoom', contactFieldValue, response => {
                            console.log(response)
                            setContactFieldHelperText(response)
                        })
                }}
                value={contactFieldValue}
                helperText={contactFieldHelperText}
                placeholder='Add contact'
            />
            { props.selectedRoom.participants.map(({username})=>(<div>{username}</div>)) }
        </Box>
    )
}
