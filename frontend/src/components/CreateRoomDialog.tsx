import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    IconButton,
    ListItem,
    ListItemButton,
    ListSubheader,
    Switch,
} from '@mui/material'
import { Box, Checkbox, Collapse, Divider, FormControl, List, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { Room, RoomDetails, RoomType, RoomWithParticipants, User } from '../types/prisma.client'
import { BorderColorRounded, DeleteRounded, RoomTwoTone } from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { Formik, Form, Field, ErrorMessage, FieldArray, useFormik, FormikHelpers } from 'formik'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { RoomListItem } from './RoomListItem'
import { MessageListAction } from '../reducer/messageListReducer'
import { SocketWithCustomEvents } from '../types/socket'
import { useFetch } from '../hooks/useFetch'
import { Routes } from '../types/routes'
import { CredentialContext } from '../contexts/Credentials'

// TODO: Incorporate yup for string validation
const validateForm = (values: { user: string } | { groupDisplayName: string }) => {
    const errors: { [key: string]: string } = {}

    const input = Object.values(values)[0]
    const key = Object.keys(values)[0]

    const MAX_LEN = 16
    const MIN_LEN = 3

    if (input.length < MIN_LEN) {
        errors[key] = `Minimum ${MIN_LEN} characters needed`
    } else if (input.length > MAX_LEN) {
        errors[key] = `Maximum ${MAX_LEN} characters allowed`
    }

    return errors
}

const MAX_ALLOWED_USERS_IN_PRIVATE_ROOM = 1

interface CreateRoomDialogProps {
    openDialog: boolean
    roomDispatcher: React.Dispatch<RoomActions>
    socketObject: SocketWithCustomEvents
    handleClose: () => void
}

export const CreateRoomDialog = ({ openDialog, socketObject, handleClose, roomDispatcher }: CreateRoomDialogProps) => {
    const { startFetching: uploadPrivateRoom } = useFetch<Room['roomId']>(Routes.post.privateRoom, true)

    const { startFetching: uploadGroup } = useFetch<Room['roomId']>(Routes.post.group, true)

    const { username } = useContext(CredentialContext)

    type initialValue = Omit<Room, 'roomId'> & { participants: User['username'][] }

    const roomInitialValues: initialValue = {
        roomType: RoomType.private,
        roomAvatar: '',
        roomDisplayName: '',
        participants: [''],
    }

    const handleFormSubmit = async (
        { roomType, roomAvatar, roomDisplayName, participants }: initialValue,
        helper: FormikHelpers<initialValue>
    ) => {
        const participantsWithUser = participants.concat(username)
        if (roomType === RoomType.private) {
            const roomId = await uploadPrivateRoom({
                method: 'post',
                body: JSON.stringify({ participants: participantsWithUser }),
            })
            // roomDispatcher({ type: RoomActionType.addRoom, room: roomId })
            if (roomId) socketObject.emit('newRoomCreated', participantsWithUser, roomId)
        } else if (roomType === RoomType.group) {
            const roomId = await uploadGroup({
                method: 'post',
                body: JSON.stringify({ participants: participantsWithUser, roomDisplayName }),
            })
            if (roomId) socketObject.emit('newRoomCreated', participantsWithUser, roomId)
        }
        handleClose()
    }
    return (
        <>
            <Dialog open={openDialog} scroll='paper' onClose={handleClose}>
                <DialogTitle>Create a new room</DialogTitle>
                <Formik initialValues={roomInitialValues} onSubmit={handleFormSubmit}>
                    {({ isSubmitting, getFieldProps, setFieldValue, values, resetForm }) => (
                        <Form>
                            <DialogContent>
                                <FormControlLabel
                                    control={<Switch />}
                                    checked={values.roomType === 'private'}
                                    label={values.roomType === 'private' ? 'private' : 'group'}
                                    {...getFieldProps('roomType')}
                                    onChange={() =>
                                        setFieldValue('roomType', values.roomType === 'private' ? 'group' : 'private')
                                    }
                                />
                            </DialogContent>

                            <DialogContent dividers>
                                <StyledTextField
                                    sx={{ px: 1 }}
                                    size='small'
                                    {...getFieldProps('roomDisplayName')}
                                    label='roomDisplayName'
                                    disabled={values.roomType === 'private'}
                                />
                            </DialogContent>

                            <DialogContent dividers>
                                <FieldArray name='participants'>
                                    {({ remove, push }) => (
                                        <List disablePadding dense>
                                            <ListSubheader>
                                                Participants
                                                <Button
                                                    disabled={
                                                        values.participants.length >=
                                                            MAX_ALLOWED_USERS_IN_PRIVATE_ROOM &&
                                                        values.roomType === 'private'
                                                    }
                                                    onClick={() => {
                                                        push('')
                                                    }}
                                                >
                                                    add
                                                </Button>
                                            </ListSubheader>
                                            {values.participants.length > 0 &&
                                                values.participants.map((username, i) => (
                                                    <ListItem
                                                        disablePadding
                                                        key={i}
                                                        secondaryAction={
                                                            <IconButton
                                                                edge='end'
                                                                aria-label='remove'
                                                                onClick={() => remove(i)}
                                                            >
                                                                <DeleteRounded />
                                                            </IconButton>
                                                        }
                                                    >
                                                        <StyledTextField
                                                            disabled={
                                                                values.roomType === 'private' &&
                                                                values.participants.length >=
                                                                    MAX_ALLOWED_USERS_IN_PRIVATE_ROOM &&
                                                                i >= MAX_ALLOWED_USERS_IN_PRIVATE_ROOM
                                                            }
                                                            sx={{ px: 1 }}
                                                            size='small'
                                                            {...getFieldProps(`participants.${i}`)}
                                                        />
                                                    </ListItem>
                                                ))}
                                        </List>
                                    )}
                                </FieldArray>
                            </DialogContent>

                            <DialogActions>
                                <ButtonGroup variant='outlined'>
                                    <Button onClick={handleClose}>Cancel</Button>
                                    <Button onClick={() => resetForm()}>Reset From</Button>
                                    <Button type='submit' disabled={isSubmitting} variant='contained'>
                                        Submit
                                    </Button>
                                </ButtonGroup>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    )
}
