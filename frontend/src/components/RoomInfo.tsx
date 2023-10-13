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
import { ForwardedRef, forwardRef, Ref, useContext, useRef, useState } from 'react'
import {
    CancelRounded,
    InfoRounded,
    NotificationsRounded,
} from '@mui/icons-material'
import { Balancer } from 'react-wrap-balancer'
import { AvatarEditorDialog } from './AvatarEditorDialog'
import { useFetch } from '../hooks/useFetch'
import { Routes } from '../types/routes'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { ConfirmationDialog } from './ConfirmationDialog'
import { CredentialContext } from '../contexts/Credentials'
import { AddGroupParticipantsDialog } from './AddGroupParticipantsDialog'
import { useSocket } from '../hooks/useSocket'

interface RoomInfoProps {
    room: RoomsState['joinedRooms'][0]
    setRoomInfoVisible: React.Dispatch<React.SetStateAction<boolean>>
    roomDispatcher: (value: RoomActions) => void
}

export const RoomInfo = (props: RoomInfoProps) => {
    const { username } = useContext(CredentialContext)

    const [openLeaveGroupDialog, setOpenLeaveGroupDialog] = useState(false)

    const toggleLeaveGroupDialog = () => setOpenLeaveGroupDialog(p => !p)

    const [openDeleteGroupDialog, setOpenDeleteGroupDialog] = useState(false)

    const toggleDeleteGroupDialog = () => setOpenDeleteGroupDialog(p => !p)

    const roomType = props.room.roomType

    const socket = useSocket()

    const roomAvatar = props.room.roomAvatar ? import.meta.env.VITE_AVATAR_STORAGE_URL + props.room.roomAvatar : ''

    const [openAvatarEditor, setOpenAvatarEditor] = useState(false)

    const handleAvatarEditorToggle = () => setOpenAvatarEditor(p => !p)

    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    const { startFetching: uploadAvater } = useFetch<string>(Routes.post.avatar, true)

    const handleImageUpload = async (newAvatar: File) => {
        if (!newAvatar) return

        const roomId = props.room.roomId

        const fd = new FormData()

        fd.append('avatar', newAvatar)
        fd.append('roomId', roomId)

        const newPath = await uploadAvater({ body: fd, method: 'POST' })

        props.roomDispatcher({
            type: RoomActionType.alterRoomProperties,
            roomId,
            newRoomProperties: { roomAvatar: newPath },
        })

        socket.emit('roomUpdated', { roomAvatar: newPath })
    }

    const { startFetching: deleteRoom } = useFetch(
        Routes.delete.room,
        true,
        `${props.room.roomId}`,
        undefined,
        () => {},
        'delete'
    )

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

                <IconButton
                    onClick={() => props.setRoomInfoVisible(false)}
                    sx={{ justifySelf: 'flex-end', ml: 'auto' }}
                >
                    <CancelRounded />
                </IconButton>
            </Stack>

            {props.room.roomType === 'group' ? (
                <>
                    {selectedImage && (
                        <AvatarEditorDialog
                            imgSrc={selectedImage}
                            handleClose={handleAvatarEditorToggle}
                            open={openAvatarEditor}
                            handleSubmit={file => {
                                setSelectedImage(null)
                                file && handleImageUpload(file)
                            }}
                        />
                    )}
                    <Tooltip title='Click to change image'>
                        <IconButton component='label' sx={{ justifySelf: 'center', alignSelf: 'center' }}>
                            <Avatar src={roomAvatar} sx={{ height: 86, width: 86 }} />

                            <input
                                type='file'
                                accept='image/*'
                                hidden
                                onChange={e => {
                                    if (!e.target.files || e.target.files.length <= 0) return
                                    handleAvatarEditorToggle()
                                    setSelectedImage(e.target.files[0])
                                }}
                            />
                        </IconButton>
                    </Tooltip>

                    <Typography align='center' variant='h6'>
                        {props.room.roomDisplayName}
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
                <Typography noWrap>Members ({props.room.participants.length})</Typography>
                {roomType === 'group' ? <AddGroupParticipantsDialog room={props.room} /> : null}
            </Stack>

            <List dense sx={{ maxHeight: '220px', overflow: 'auto' }}>
                {props.room.participants.map(({ username }, i) => (
                    <ListItem key={i}>
                        <ListItemAvatar>
                            <Avatar sizes='14px' sx={{ height: '24px', width: '24px' }} src='' />
                        </ListItemAvatar>
                        <ListItemText>{username}</ListItemText>
                    </ListItem>
                ))}
            </List>

            {props.room.roomType === 'group' ? (
                <ButtonGroup size='small' variant='text' fullWidth>
                    <Button onClick={toggleDeleteGroupDialog} disabled={props.room.isAdmin === false}>
                        Delete Group
                    </Button>
                    <Button onClick={toggleLeaveGroupDialog}>Leave Group</Button>
                </ButtonGroup>
            ) : null}
            <ConfirmationDialog
                openDialog={openLeaveGroupDialog}
                toggleConfirmationDialog={toggleLeaveGroupDialog}
                onAccept={() => {
                    socket.emit('userLeftRoom', props.room.roomId)
                }}
            />
            <ConfirmationDialog
                openDialog={openDeleteGroupDialog}
                toggleConfirmationDialog={toggleDeleteGroupDialog}
                onAccept={() => {
                    socket.emit('roomDeleted', props.room.roomId)
                }}
            />
        </Box>
    )
}
