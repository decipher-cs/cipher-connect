import {
    Avatar,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    Stack,
    Tooltip,
    Switch,
    ButtonGroup,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Checkbox,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import {
    BookmarkBorderRounded,
    BookmarkRounded,
    CancelRounded,
    InfoRounded,
    NotificationsRounded,
    PinRounded,
    PushPinOutlined,
    PushPinRounded,
    StarRounded,
    TryRounded,
} from '@mui/icons-material'
import { Routes } from '../types/routes'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { ConfirmationDialog } from './ConfirmationDialog'
import { AddGroupParticipantsDialog } from './AddGroupParticipantsDialog'
import { useSocket } from '../hooks/useSocket'
import { useMutation } from '@tanstack/react-query'
import { axiosServerInstance } from '../App'
import { useImageEditor } from '../hooks/useImageEditor'
import { ImageEditorDialog } from './ImageEditorDialog'
import { useDialog } from '../hooks/useDialog'
import { useAuth } from '../hooks/useAuth'
import { Room, UserRoom } from '../types/prisma.client'

interface RoomInfoProps {
    room: RoomsState['joinedRooms'][0]
    handleToggleRoomInfoSidebar: () => void
    roomDispatcher: (value: RoomActions) => void
}

type UserRoomPersonalConfig = Partial<
    Pick<UserRoom, 'isNotificationMuted' | 'isHidden' | 'isPinned' | 'isMarkedFavourite'>
>
type UserRoomSharedConfig = Partial<Pick<UserRoom, 'isBlocked' | 'lastReadMessage' | 'isAdmin' | 'joinedAt'>>

type RoomSharedConfig = Partial<Pick<Room, 'roomAvatar' | 'roomDisplayName'>>

export const RoomInfo = ({ room, roomDispatcher, handleToggleRoomInfoSidebar, ...props }: RoomInfoProps) => {
    const {
        authStatus: { username },
    } = useAuth()

    const socket = useSocket()

    const { imageEditroDialogProps, sourceImage, setSourceImage, handleOpen, editedImageData } = useImageEditor()

    const { handleToggle: toggleLeaveGroupDialog, dialogOpen: openLeaveGroupDialog } = useDialog()

    const { handleToggle: toggleDeleteGroupDialog, dialogOpen: openDeleteGroupDialog } = useDialog()

    const { mutateAsync: updateUserRoom } = useMutation({
        mutationKey: ['UserRoomMutableOptions', room.roomId],
        mutationFn: async (newConfig: UserRoomPersonalConfig) => {
            const res = await axiosServerInstance.put(Routes.put.personalUserRoomConfig, {
                roomId: room.roomId,
                ...newConfig,
            })
            // const res = await axiosServerInstance.put(Routes.put.userRoom, { roomId: room.roomId, ...newConfig })
            return res
        },
        onMutate: newConfig => {
            roomDispatcher({
                type: RoomActionType.updateRoomDetails,
                roomId: room.roomId,
                newRoomProperties: newConfig,
            })
        },
        onError: (err, oldConfig, context) => {
            console.log(err, oldConfig, context)
            // roomDispatcher({
            //     type: RoomActionType.changeRoomSettings,
            //     roomId: room.roomId,
            //     newRoomProperties: oldConfig,
            // })
        },
    })

    const updateSharedUserRoomConfig = async (updatedConfig: UserRoomSharedConfig) => {
        axiosServerInstance.put(Routes.put.sharedUserRoomConfig, updatedConfig)
    }

    const handleImageUpload = async (newAvatar: File) => {
        if (!newAvatar) return

        const roomId = room.roomId

        const fd = new FormData()

        fd.append('upload', newAvatar)
        fd.append('roomId', roomId)

        const response = await axiosServerInstance.post<string>(Routes.post.avatar, fd)
        if (response.status !== 200) {
            console.log('error while updating group avatar.')
        }

        // roomDispatcher({
        //     type: RoomActionType.alterRoomProperties,
        //     roomId,
        //     newRoomProperties: { roomAvatar: newPath },
        // })
    }

    useEffect(() => {
        if (editedImageData?.file) {
            handleImageUpload(editedImageData?.file)
        }
    }, [editedImageData?.file])

    return (
        <Box
            sx={{
                width: 'min(25vw, 450px)',
                minHeight: '100%',
                backgroundColor: theme => theme.palette.background.light,

                alignContent: 'flex-start',

                display: 'grid',
                px: 3,
                py: 1,
                gap: 2,
            }}
        >
            <Stack direction='row' sx={{ alignItems: 'center', gap: 2 }}>
                <InfoRounded sx={{ justifySelf: 'flex-start' }} color='primary' />

                <Typography sx={{ justifySelf: 'flex-start' }}>Room Info</Typography>

                <Checkbox
                    sx={{ justifySelf: 'flex-end', ml: 'auto' }}
                    checkedIcon={<PushPinRounded />}
                    icon={<PushPinOutlined />}
                    checked={room.isPinned}
                    onChange={(_, checked) => {
                        updateUserRoom({ isPinned: checked })
                    }}
                />

                <IconButton onClick={handleToggleRoomInfoSidebar} sx={{ justifySelf: 'flex-end' }}>
                    <CancelRounded />
                </IconButton>
            </Stack>

            {room.roomType === 'group' ? (
                <>
                    {sourceImage ? <ImageEditorDialog {...imageEditroDialogProps} sourceImage={sourceImage} /> : null}

                    <Tooltip title='Click to change image'>
                        <IconButton component='label' sx={{ justifySelf: 'center', alignSelf: 'center' }}>
                            <Avatar src={room.roomAvatar ?? ''} sx={{ height: 86, width: 86 }} />

                            <input
                                type='file'
                                accept='image/*'
                                hidden
                                onChange={e => {
                                    if (!e.target.files || e.target.files.length <= 0) return
                                    setSourceImage(e.target.files[0])
                                    handleOpen()
                                }}
                            />
                        </IconButton>
                    </Tooltip>

                    <Typography align='center' variant='h6'>
                        {room.roomDisplayName}
                    </Typography>
                </>
            ) : null}

            <Divider />

            <Stack direction='row' alignItems='center' gap={2}>
                <NotificationsRounded />
                Mute Notifications
                <Switch
                    sx={{ ml: 'auto' }}
                    checked={room.isNotificationMuted}
                    onChange={(_, checked) => {
                        // changeNotificationSetting({ isNotificationMuted: checked })
                        updateUserRoom({ isNotificationMuted: checked })
                    }}
                />
            </Stack>

            <Stack direction='row' alignItems='center' gap={2}>
                <TryRounded />
                Mark As Favorite
                <Checkbox
                    sx={{ ml: 'auto' }}
                    checkedIcon={<BookmarkRounded />}
                    icon={<BookmarkBorderRounded />}
                    onChange={(e, checked) => {
                        updateUserRoom({ isMarkedFavourite: checked })
                    }}
                />
            </Stack>

            <Divider />

            <Stack direction='row' sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Typography noWrap>Members ({room.participants.length})</Typography>
                {room.roomType === 'group' ? <AddGroupParticipantsDialog room={room} /> : null}
            </Stack>

            <List dense sx={{ maxHeight: '220px', overflow: 'auto' }}>
                {room.participants.map((username, i) => (
                    <ListItem key={i}>
                        <ListItemAvatar>
                            <Avatar sizes='14px' sx={{ height: '24px', width: '24px' }} src='' />
                        </ListItemAvatar>
                        <ListItemText>{username}</ListItemText>
                    </ListItem>
                ))}
            </List>

            {room.roomType === 'group' ? (
                <ButtonGroup size='small' variant='text' fullWidth>
                    <Button onClick={toggleDeleteGroupDialog} disabled={!room.isAdmin}>
                        Delete Group
                    </Button>
                    <Button onClick={toggleLeaveGroupDialog}>Leave Group</Button>
                </ButtonGroup>
            ) : null}
            <ConfirmationDialog
                openDialog={openLeaveGroupDialog}
                toggleConfirmationDialog={toggleLeaveGroupDialog}
                onAccept={() => {
                    axiosServerInstance
                        .delete(Routes.delete.userRoom + '/' + username + '/' + room.roomId)
                        .then(res => res.data)
                    // socket.emit('userLeftRoom', room.roomId)
                }}
            />
            <ConfirmationDialog
                openDialog={openDeleteGroupDialog}
                toggleConfirmationDialog={toggleDeleteGroupDialog}
                onAccept={() => {
                    axiosServerInstance.delete(Routes.delete.room).then(res => res.data)
                    // socket.emit('roomDeleted', room.roomId)
                }}
            />
        </Box>
    )
}
