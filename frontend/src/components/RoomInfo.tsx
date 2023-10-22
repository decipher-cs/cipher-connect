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
} from '@mui/material'
import { ForwardedRef, forwardRef, Ref, useContext, useEffect, useRef, useState } from 'react'
import { CancelRounded, InfoRounded, NotificationsRounded } from '@mui/icons-material'
import { Balancer } from 'react-wrap-balancer'
import { AvatarEditorDialog } from './AvatarEditorDialog'
import { Routes } from '../types/routes'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { ConfirmationDialog } from './ConfirmationDialog'
import { CredentialContext } from '../contexts/Credentials'
import { AddGroupParticipantsDialog } from './AddGroupParticipantsDialog'
import { useSocket } from '../hooks/useSocket'
import { useMutation } from '@tanstack/react-query'
import { axiosServerInstance } from '../App'
import { useImageEditor } from '../hooks/useImageEditor'
import { ImageEditorDialog } from './ImageEditorDialog'
import { useDialog } from '../hooks/useDialog'

interface RoomInfoProps {
    room: RoomsState['joinedRooms'][0]
    handleToggleRoomInfoSidebar: () => void
    roomDispatcher: (value: RoomActions) => void
}

export const RoomInfo = ({ room, roomDispatcher, handleToggleRoomInfoSidebar, ...props }: RoomInfoProps) => {
    const socket = useSocket()

    const { imageEditroDialogProps, sourceImage, setSourceImage, handleOpen, editedImageData } = useImageEditor()

    const { handleToggle: toggleLeaveGroupDialog, dialogOpen: openLeaveGroupDialog } = useDialog()

    const { handleToggle: toggleDeleteGroupDialog, dialogOpen: openDeleteGroupDialog } = useDialog()

    const roomAvatar = room.roomAvatar ? import.meta.env.VITE_AVATAR_STORAGE_URL + room.roomAvatar : ''

    const { mutateAsync: uploadAvatar } = useMutation({
        mutationKey: ['uploadAvatar'],
        mutationFn: (data: FormData) =>
            axiosServerInstance.post<string>(Routes.post.avatar, data).then(res => res.data),
    })

    const { mutateAsync: deleteRoom } = useMutation({
        mutationKey: ['uploadAvatar'],
        mutationFn: () => axiosServerInstance.delete(Routes.delete.room).then(res => res.data),
        onSuccess: () => {
            // invalidate query  some query and cause a refetch
        },
    })

    const handleImageUpload = async (newAvatar: File) => {
        if (!newAvatar) return

        const roomId = room.roomId

        const fd = new FormData()

        fd.append('avatar', newAvatar)
        fd.append('roomId', roomId)

        const newPath = await uploadAvatar(fd)

        roomDispatcher({
            type: RoomActionType.alterRoomProperties,
            roomId,
            newRoomProperties: { roomAvatar: newPath },
        })

        socket.emit('roomUpdated', { roomAvatar: newPath })
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

                alignContent: 'flex-start',

                display: 'grid',
                px: 3,
                gap: 1.3,
            }}
        >
            <Stack direction='row' sx={{ alignItems: 'center' }}>
                <InfoRounded sx={{ justifySelf: 'flex-start' }} />

                <Typography sx={{ justifySelf: 'flex-start' }}>Room Info</Typography>

                <IconButton onClick={handleToggleRoomInfoSidebar} sx={{ justifySelf: 'flex-end', ml: 'auto' }}>
                    <CancelRounded />
                </IconButton>
            </Stack>

            {room.roomType === 'group' ? (
                <>
                    {sourceImage ? <ImageEditorDialog {...imageEditroDialogProps} sourceImage={sourceImage} /> : null}
                    <Tooltip title='Click to change image'>
                        <IconButton component='label' sx={{ justifySelf: 'center', alignSelf: 'center' }}>
                            <Avatar src={roomAvatar} sx={{ height: 86, width: 86 }} />

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

                    {/* <EditableText text={roomName} setText={setRoomName} /> */}
                    <Box sx={{ height: 'fit-content', overflowY: 'auto' }}>
                        <Typography>Description:</Typography>
                        <Typography variant='body2' paragraph>
                            <Balancer>
                                Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate vvoluptate dolor
                                minim null aoluptate dolor minim nullavoluptate dolor minim null
                            </Balancer>
                        </Typography>
                    </Box>
                </>
            ) : null}

            <Divider />

            <Stack direction='row' alignItems='center'>
                <NotificationsRounded />
                Notifications
                <Switch sx={{ ml: 'auto' }} />
            </Stack>

            <Divider />

            <Stack direction='row' sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Typography noWrap>Members ({room.participants.length})</Typography>
                {room.roomType === 'group' ? <AddGroupParticipantsDialog room={room} /> : null}
            </Stack>

            <List dense sx={{ maxHeight: '220px', overflow: 'auto' }}>
                {room.participants.map(({ username }, i) => (
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
                    <Button onClick={toggleDeleteGroupDialog} disabled={room.isAdmin === false}>
                        Delete Group
                    </Button>
                    <Button onClick={toggleLeaveGroupDialog}>Leave Group</Button>
                </ButtonGroup>
            ) : null}
            <ConfirmationDialog
                openDialog={openLeaveGroupDialog}
                toggleConfirmationDialog={toggleLeaveGroupDialog}
                onAccept={() => {
                    socket.emit('userLeftRoom', room.roomId)
                }}
            />
            <ConfirmationDialog
                openDialog={openDeleteGroupDialog}
                toggleConfirmationDialog={toggleDeleteGroupDialog}
                onAccept={() => {
                    socket.emit('roomDeleted', room.roomId)
                }}
            />
        </Box>
    )
}
