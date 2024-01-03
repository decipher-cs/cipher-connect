import { Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt'
import React, { memo, useContext, useEffect, useState } from 'react'
import { MessageListAction, MessageListActionType } from '../reducer/messageListReducer'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { Message } from '../types/prisma.client'
import { Routes } from '../types/routes'
import { UseMutateFunction, useMutation, useQuery } from '@tanstack/react-query'
import { axiosServerInstance } from '../App'
import { useSocket } from '../hooks/useSocket'
import { useAuth } from '../hooks/useAuth'

interface RoomListItemProps {
    room: RoomsState['joinedRooms'][0]
    roomDispatcher: React.Dispatch<RoomActions>
    selectedRoomIndex: RoomsState['selectedRoomIndex']
    thisRoomIndex: number
    usersInfo: RoomsState['usersInfo']
    mutateMessageReadStatus: UseMutateFunction<any, unknown, { roomId: string; messageStatus: boolean }, unknown>
    mostRecentMessage: Message['content']
}

export const RoomListItem = memo((props: RoomListItemProps) => {
    const { selectedRoomIndex, room, usersInfo, roomDispatcher, thisRoomIndex, ...rest } = props

    const {
        authStatus: { username },
    } = useAuth()

    const displayName =
        room.roomType === 'private' ? room.participants.filter(name => name !== username)[0] : room.roomDisplayName

    const displayImage = (() => {
        if (room.roomType === 'group') return room.roomAvatar ?? undefined

        const otherMember = room.participants.filter(name => name !== username)[0]

        if (!otherMember) return otherMember

        const otherUserInfo = usersInfo[otherMember]

        return otherUserInfo?.avatarPath ?? undefined
    })()

    return (
        <ListItemButton
            divider
            onClick={async () => {
                try {
                    // console.log(thisRoomIndex, selectedRoomIndex)
                    if (thisRoomIndex === selectedRoomIndex) return

                    props.roomDispatcher({ type: RoomActionType.changeSelectedRoom, newlySelectedIndex: thisRoomIndex })

                    // props.roomDispatcher({
                    //     type: RoomActionType.changeNotificationStatus,
                    //     roomId: props.room.roomId,
                    //     unreadMessages: false,
                    // })

                    // if (props.room.lastReadMessage === true)
                    // props.mutateMessageReadStatus({ roomId: props.room.roomId, messageStatus: false })
                } catch (error) {
                    throw new Error('Error during room selection')
                }
            }}
            selected={selectedRoomIndex === thisRoomIndex}
        >
            <ListItem disableGutters disablePadding>
                <ListItemIcon>
                    <Avatar src={displayImage} />
                </ListItemIcon>

                {/*TODO: Manage text overflow using primartyTextProps*/}
                <ListItemText primary={displayName} secondary={props.room.roomType} />
            </ListItem>

            <Typography variant='caption' color={'grey'} textOverflow='clip' noWrap>
                {props.mostRecentMessage}
            </Typography>
            {/* {props.room.hasUnreadMessages === true && props.room.isNotificationMuted === false ? ( */}
            {/*     <MarkUnreadChatAltIcon /> */}
            {/* ) : null} */}
        </ListItemButton>
    )
})
