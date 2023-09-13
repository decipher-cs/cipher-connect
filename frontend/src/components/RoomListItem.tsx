import { Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useContext } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { RoomActions, RoomActionType } from '../reducer/roomReducer'
import { RoomWithParticipants } from '../types/socket'

interface RoomListItemProps {
    room: RoomWithParticipants
    roomDispatcher: React.Dispatch<RoomActions>
    selectedRoomIndex: number | null
    currentRoomIndex: number
}

export const RoomListItem = (props: RoomListItemProps) => {
    const { username } = useContext(CredentialContext)

    let displayName = (() => {
        if (props.room.isMaxCapacityTwo === true) {
            const name = props.room.participants.filter(p => p.username !== username).at(0)?.username
            if (name === undefined) throw new Error('afewl')
            else return name
        } else return props.room.roomDisplayName
    })()

    let displayImage = (() => {
        if (props.room.isMaxCapacityTwo === true) {
            const name = props.room.participants.filter(p => p.username !== username).at(0)?.username
            if (name === undefined) throw new Error('afewl')
            // axios.get() // TODO: fetch image from path
        }
        // axios.get() // TODO: fetch image from path
        // const fetchMessages = useFetch(import.meta.env.VITE_SERVER_URL + '/faewfaewf')
        return props.room.roomDisplayImagePath ?? ''
    })()

    const roomType = props.room.isMaxCapacityTwo === true ? 'private' : 'group'

    return (
        <ListItemButton
            divider
            onClick={() => {
                props.roomDispatcher({ type: RoomActionType.CHANGE_ROOM, newRoomIndex: props.currentRoomIndex })
            }}
            selected={props.selectedRoomIndex === props.currentRoomIndex}
        >
            <ListItem disableGutters disablePadding>
                <ListItemIcon>
                    <Avatar src={displayImage} />
                </ListItemIcon>

                <ListItemText primary={displayName} secondary={roomType} />
            </ListItem>
        </ListItemButton>
    )
}
