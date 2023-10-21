import { Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt'
import React, { memo, useContext, useEffect, useState } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { MessageListAction, MessageListActionType } from '../reducer/messageListReducer'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { Message } from '../types/prisma.client'
import { Routes } from '../types/routes'
import { UseMutateFunction, useMutation, useQuery } from '@tanstack/react-query'
import { axiosServerInstance } from '../App'
import { useSocket } from '../hooks/useSocket'

interface RoomListItemProps {
    room: RoomsState['joinedRooms'][0]
    roomDispatcher: React.Dispatch<RoomActions>
    selectedRoomIndex: RoomsState['selectedRoom']
    roomIndex: number
    mutateMessageReadStatus: UseMutateFunction<any, unknown, { roomId: string; messageStatus: boolean }, unknown>
}

export const RoomListItem = memo((props: RoomListItemProps) => {
    const { username } = useContext(CredentialContext)

    const [displayName, setDiplayName] = useState(() => {
        return props.room.roomType === 'private' && props.room.roomAvatar === null
            ? props.room.participants.filter(p => p.username !== username)[0]?.username
            : props.room.roomDisplayName
    })

    const displayImage =
        props.room.roomType === 'group'
            ? import.meta.env.VITE_AVATAR_STORAGE_URL + props.room.roomAvatar
            : import.meta.env.VITE_AVATAR_STORAGE_URL +
              props.room.participants.find(p => p.username === displayName)?.avatarPath

    return (
        <ListItemButton
            divider
            onClick={async () => {
                try {
                    if (props.roomIndex === props.selectedRoomIndex) return

                    props.roomDispatcher({ type: RoomActionType.changeRoom, newRoomIndex: props.roomIndex })

                    props.roomDispatcher({
                        type: RoomActionType.changeNotificationStatus,
                        roomId: props.room.roomId,
                        unreadMessages: false,
                    })

                    if (props.room.hasUnreadMessages === true)
                        props.mutateMessageReadStatus({ roomId: props.room.roomId, messageStatus: false })
                } catch (error) {
                    throw new Error('Error during room selection')
                }
            }}
            selected={props.selectedRoomIndex === props.roomIndex}
        >
            <ListItem disableGutters disablePadding>
                <ListItemIcon>
                    <Avatar src={displayImage ? displayImage : ''} />
                </ListItemIcon>

                {/*TODO: Manage text overflow using primartyTextProps*/}
                <ListItemText primary={displayName} secondary={props.room.roomType} />
            </ListItem>

            {props.room.hasUnreadMessages === true ? <MarkUnreadChatAltIcon /> : null}
        </ListItemButton>
    )
})
