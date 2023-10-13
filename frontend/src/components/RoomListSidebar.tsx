import { Box, Button, IconButton, List, Typography } from '@mui/material'
import { useState } from 'react'
import { AddToPhotosRounded, BorderColorRounded } from '@mui/icons-material'
import { RoomActions, RoomsState } from '../reducer/roomReducer'
import { RoomListItem } from './RoomListItem'
import { MessageListAction } from '../reducer/messageListReducer'
import { CreateRoomDialog } from './CreateRoomDialog'
import { useDialog } from '../hooks/useDialog'

interface RoomListSidebar {
    roomDispatcher: React.Dispatch<RoomActions>
    rooms: RoomsState
    messageListDispatcher: React.Dispatch<MessageListAction>
}

export const RoomListSidebar = (props: RoomListSidebar) => {
    const { handleClose, handleOpen, dialogOpen } = useDialog()

    return (
        <Box
            sx={{
                flexShrink: 0,
                flexGrow: 0,
                width: '23%',
                minWidth: 'max-content',

                display: 'grid',
                alignContent: 'flex-start',
            }}
        >
            <Typography pl={2} display={'inline'} sx={{ gridArea: '1 / 1 / 1 / 1', alignSelf: 'center' }}>
                Messages
            </Typography>
            <IconButton onClick={handleOpen} sx={{ justifySelf: 'flex-end', gridArea: '1 / 1 / 1 / 1', pr: 2 }}>
                <AddToPhotosRounded />
            </IconButton>

            <CreateRoomDialog dialogOpen={dialogOpen} roomDispatcher={props.roomDispatcher} handleClose={handleClose} />

            <List sx={{ overflowY: 'auto' }}>
                {props.rooms.joinedRooms.map((room, i) => {
                    return (
                        <RoomListItem
                            key={room.roomId}
                            roomIndex={i}
                            selectedRoomIndex={props.rooms.selectedRoom}
                            room={room}
                            roomDispatcher={props.roomDispatcher}
                            messageListDispatcher={props.messageListDispatcher}
                        />
                    )
                })}
            </List>
        </Box>
    )
}
