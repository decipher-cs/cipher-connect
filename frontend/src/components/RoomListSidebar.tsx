import { Box, Checkbox, Collapse, Divider, FormControl, IconButton, List, Typography } from '@mui/material'
import { useState } from 'react'
import { RoomWithParticipants } from '../types/prisma.client'
import { AddToPhotosRounded, BorderColorRounded } from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { Form, useFormik } from 'formik'
import { RoomActions, RoomsState } from '../reducer/roomReducer'
import { RoomListItem } from './RoomListItem'
import { MessageListAction } from '../reducer/messageListReducer'
import { SocketWithCustomEvents } from '../types/socket'
import { useFetch } from '../hooks/useFetch'
import { CreateRoomDialog } from './CreateRoomDialog'

interface RoomListSidebar {
    roomDispatcher: React.Dispatch<RoomActions>
    rooms: RoomsState['joinedRooms']
    selectedRoomIndex: RoomsState['selectedRoom']
    messageListDispatcher: React.Dispatch<MessageListAction>
}

export const RoomListSidebar = (props: RoomListSidebar) => {
    const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false)

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

            <IconButton
                onClick={() => {
                    setShowCreateRoomDialog(true)
                }}
                sx={{ justifySelf: 'flex-end', gridArea: '1 / 1 / 1 / 1', pr: 2 }}
            >
                <AddToPhotosRounded />

                <CreateRoomDialog
                    openDialog={showCreateRoomDialog}
                    roomDispatcher={props.roomDispatcher}
                    handleClose={() => setShowCreateRoomDialog(false)}
                />
            </IconButton>

            <List sx={{ overflowY: 'auto' }}>
                {props.rooms.map((room, i) => {
                    return (
                        <RoomListItem
                            key={room.roomId}
                            roomIndex={i}
                            selectedRoomIndex={props.selectedRoomIndex}
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
