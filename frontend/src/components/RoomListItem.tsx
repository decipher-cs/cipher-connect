import { Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt'
import React, { useContext, useState } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { useFetch } from '../hooks/useFetch'
import { MessageListAction, MessageListActionType } from '../reducer/messageListReducer'
import { RoomActions, RoomActionType } from '../reducer/roomReducer'
import { Message } from '../types/prisma.client'
import { Routes } from '../types/routes'
import { RoomWithParticipants } from '../types/socket'

interface RoomListItemProps {
    room: RoomWithParticipants
    roomDispatcher: React.Dispatch<RoomActions>
    selectedRoomIndex: number | null
    roomIndex: number
    messageListDispatcher: React.Dispatch<MessageListAction>
}

export const RoomListItem = (props: RoomListItemProps) => {
    const { username } = useContext(CredentialContext)

    const { startFetching: initializeMessages } = useFetch<Message[]>(Routes.get.messages, true, props.room.roomId)

    const roomType = props.room.isMaxCapacityTwo === true ? 'private' : 'group'

    const [displayName, setDiplayName] = useState(() => {
        return roomType === 'private' && props.room.roomDisplayImagePath === null
            ? props.room.participants.filter(p => p.username !== username)[0]?.username
            : props.room.roomDisplayName
    })

    const displayImage =
        roomType === 'group'
            ? import.meta.env.VITE_AVATAR_STORAGE_URL + props.room.roomDisplayImagePath
            : import.meta.env.VITE_AVATAR_STORAGE_URL +
              props.room.participants.find(p => p.username === displayName)?.avatarPath

    console.log(roomType, displayName, displayImage)
    return (
        <ListItemButton
            divider
            onClick={async () => {
                if (props.roomIndex === props.selectedRoomIndex) return
                props.roomDispatcher({ type: RoomActionType.CHANGE_ROOM, newRoomIndex: props.roomIndex })
                const messages = await initializeMessages()

                props.messageListDispatcher({
                    type: MessageListActionType.INITIALIZE_MESSAGES,
                    newMessages: messages,
                })
            }}
            selected={props.selectedRoomIndex === props.roomIndex}
        >
            <ListItem disableGutters disablePadding>
                <ListItemIcon>
                    <Avatar src={displayImage ? displayImage : ''} />
                </ListItemIcon>

                {/*TODO: Manage text overflow using primartyTextProps*/}
                <ListItemText primary={displayName} secondary={roomType} />
            </ListItem>

            <MarkUnreadChatAltIcon />
        </ListItemButton>
    )
}
