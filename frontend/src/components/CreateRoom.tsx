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
import { Formik, Form, Field, ErrorMessage, FieldArray, useFormik } from 'formik'
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

export const CreateRoom = ({
    openDialog,
    socketObject,
    handleClose,
    roomDispatcher,
}: {
    openDialog: boolean
    roomDispatcher: React.Dispatch<RoomActions>
    socketObject: SocketWithCustomEvents
    handleClose: () => void
}) => {
    // const formikAddUser = useFormik({
    //     initialValues: { user: '' },
    //     validate: validateForm,
    //     onSubmit: async ({ user }) => {
    //         socketObject.emit('createNewPrivateRoom', user.trim(), response => {
    //             if (response === null) {
    //                 // TODO: reset form dirty so it doesn't show validation error after submitting
    //                 formikAddUser.resetForm()
    //             } else formikAddUser.setFieldError('user', response)
    //         })
    //         formikAddUser.resetForm()
    //     },
    // })

    // const formikCreateGroup = useFormik({
    //     initialValues: { groupDisplayName: '' },
    //     validate: validateForm,
    //     onSubmit: async ({ groupDisplayName }) => {
    //         socketObject.emit('createNewGroup', [], groupDisplayName, response => {
    //             response === null
    //                 ? formikCreateGroup.resetForm()
    //                 : formikCreateGroup.setFieldError('groupDisplayName', response)
    //         })
    //     },
    // })

    const { startFetching: uploadPrivateRoom } = useFetch<RoomDetails[]>(Routes.post.privateRoom, true)

    const { startFetching: uploadGroup } = useFetch<RoomDetails[]>(Routes.post.group, true)

    const { username } = useContext(CredentialContext)

    type initialValue = Omit<Room, 'roomId'> & { participants: User['username'][] }

    const roomInitialValues: initialValue = {
        roomType: RoomType.private,
        roomAvatar: '',
        roomDisplayName: '',
        participants: [''],
    }

    const handleFormSubmit = async ({ roomType, roomAvatar, roomDisplayName, participants }: initialValue) => {
        console.log('form submitted', roomType, participants)
        if (roomType === RoomType.private) {
            const result = await uploadPrivateRoom({
                method: 'post',
                body: JSON.stringify({ participants: participants.concat(username) }),
            })
            roomDispatcher({ type: RoomActionType.addRoom, room: result })
            // socketObject.emit('createNewGroup', participants, roomDisplayName, response => {
            // ? formikCreateGroup.resetForm()
            // : formikCreateGroup.setFieldError('groupDisplayName', response)
            // })
        } else if (roomType === RoomType.group) {
            console.log(roomDisplayName)
            const result = await uploadGroup({
                method: 'post',
                body: JSON.stringify({ participants: participants.concat(username), roomDisplayName }),
            })
            roomDispatcher({ type: RoomActionType.addRoom, room: result })

            //     const usernames = participant.map(({ username }) => username)
            //     // socketObject.emit('createNewPrivateRoom', usernames, response => {})
            //     // formikAddUser.resetForm()
        }
    }
    return (
        <>
            <Dialog open={openDialog} fullWidth scroll='paper'>
                <DialogTitle>Create a new room</DialogTitle>
                <Formik initialValues={roomInitialValues} onSubmit={handleFormSubmit}>
                    {({ isSubmitting, getFieldProps, setFieldValue, values }) => (
                        <Form>
                            <DialogContent>
                                <FormControlLabel
                                    control={<Switch />}
                                    checked={values.roomType === 'private'}
                                    label={values.roomType === 'private' ? 'private' : 'group'}
                                    {...getFieldProps('roomType')}
                                    onChange={(e, checked) =>
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

                            <FieldArray name='participants'>
                                {({ remove, push }) => (
                                    <DialogContent dividers>
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
                                    </DialogContent>
                                )}
                            </FieldArray>
                            {/* image*/}

                            <DialogActions>
                                <ButtonGroup>
                                    <Button onClick={handleClose}>Cancel</Button>
                                    <Button>Clear</Button>
                                    <Button type='submit' disabled={isSubmitting}>
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
