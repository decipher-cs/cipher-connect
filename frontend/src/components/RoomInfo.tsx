import {
    Avatar,
    TextField,
    Box,
    Icon,
    Typography,
    IconButton,
    Button,
    Drawer,
    InputAdornment,
    Divider,
    Stack,
    Tooltip,
    Switch,
    ButtonGroup,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Collapse,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { SocketWithCustomEvents } from '../types/socket'
import { ForwardedRef, forwardRef, Ref, useContext, useRef, useState } from 'react'
import {
    ArrowForwardRounded,
    CancelRounded,
    DeleteRounded,
    DoneAllRounded,
    InfoRounded,
    NotificationsRounded,
    PersonAddRounded,
    RemoveRounded,
    SearchSharp,
    SettingsRemoteSharp,
} from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { EditableText } from './EditableText'
import { Balancer } from 'react-wrap-balancer'
import { AvatarEditorDialog } from './AvatarEditorDialog'
import AvatarEditor from 'react-avatar-editor'
import { useFetch } from '../hooks/useFetch'
import { Routes } from '../types/routes'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { ConfirmationDialog } from './ConfirmationDialog'
import { CredentialContext } from '../contexts/Credentials'
import { useFormik, FormikErrors } from 'formik'

interface RoomInfoProps {
    room: RoomsState['joinedRooms'][0]
    socketObject: SocketWithCustomEvents
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

        props.socketObject.emit('roomUpdated', { roomAvatar: newPath })
    }

    const { startFetching: leaveRoom } = useFetch(
        Routes.delete.userRoom,
        true,
        `${username}/${props.room.roomId}`,
        undefined,
        () => {},
        'delete'
    )

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
                {roomType === 'group' ? (
                    <AddGroupParticipantsDialog socketObject={props.socketObject} room={props.room} />
                ) : null}
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
                onAccept={async () => {
                    await leaveRoom()
                    props.socketObject.emit('userLeftRoom', props.room.roomId)
                }}
            />
            <ConfirmationDialog
                openDialog={openDeleteGroupDialog}
                toggleConfirmationDialog={toggleDeleteGroupDialog}
                onAccept={async () => {
                    await deleteRoom()
                    // props.socketObject.emit()
                }}
            />
        </Box>
    )
}

const AddGroupParticipantsDialog = (props: {
    socketObject: SocketWithCustomEvents
    room: RoomsState['joinedRooms'][0]
}) => {
    const { username } = useContext(CredentialContext)

    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => setIsOpen(false)

    const { startFetching: varifyUsername } = useFetch<boolean>(Routes.get.isUsernameValid, true)

    const { startFetching: addParticipants } = useFetch<boolean>(Routes.post.participants, true)

    const handleSubmit = async ({ usersToBeAdded }: { usersToBeAdded: string[] }) => {
        const res = await addParticipants({
            body: JSON.stringify({ roomId: props.room.roomId, participants: usersToBeAdded }),
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })

        console.log(res)
    }

    const handleValidation = async ({ usersToBeAdded }: { usersToBeAdded: string[] }) => {
        const errors = await Promise.all(
            usersToBeAdded.map(async username => {
                if (username.length < 3) return 'Min length is 3 characters'
                if (username.length > 16) return 'Max length is 16 characters, i think...'

                const valid = await varifyUsername(undefined, [username])

                return valid === true ? undefined : 'Invalid Username'
            })
        )
        for (const err of errors) {
            if (err !== undefined) return { usersToBeAdded: errors }
        }
        return undefined
    }

    const { setFieldValue, getFieldProps, errors, isValidating, dirty, touched, values, isSubmitting, submitForm } =
        useFormik({
            initialValues: { usersToBeAdded: [''] },
            onSubmit: handleSubmit,
            // validate: async ({ usersToBeAdded }: { usersToBeAdded: string[] }) => {
            //     return new Promise(res => {
            //         res()
            //         // res({ usersToBeAdded: [undefined, undefined] })
            //     })
            // },
            validate: handleValidation,
        })

    const handleAddTextField = () => setFieldValue('usersToBeAdded', [...values.usersToBeAdded, ''])
    const handleRemoveTextField = (index: number) =>
        setFieldValue('usersToBeAdded', [...values.usersToBeAdded.filter((_, i) => i !== index)])

    return (
        <>
            <IconButton onClick={() => setIsOpen(true)}>
                <PersonAddRounded />
            </IconButton>
            <Dialog open={isOpen} onClose={handleClose} fullWidth>
                <DialogTitle>Add members to group</DialogTitle>

                <Button onClick={handleAddTextField}>Add</Button>

                <DialogContent>
                    {values.usersToBeAdded.map((value, i) => (
                        <StyledTextField
                            key={i}
                            size='small'
                            sx={{ width: '100%' }}
                            {...getFieldProps(`usersToBeAdded.${i}`)}
                            placeholder='Add User'
                            error={errors.usersToBeAdded !== undefined && errors.usersToBeAdded[i] !== undefined}
                            helperText={errors.usersToBeAdded && errors.usersToBeAdded[i]}
                            InputProps={{
                                endAdornment: (
                                    <>
                                        {isValidating ? <CircularProgress size={'1rem'} /> : <DoneAllRounded />}
                                        <IconButton onClick={() => handleRemoveTextField(i)}>
                                            <DeleteRounded />
                                        </IconButton>
                                    </>
                                ),
                            }}
                        />
                    ))}
                </DialogContent>

                <DialogActions>
                    <ButtonGroup>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            disabled={isSubmitting}
                            onClick={async () => {
                                try {
                                    await submitForm()
                                    // handleClose()
                                } catch (error) {
                                    throw error
                                }
                            }}
                        >
                            Confirm
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    )
}
