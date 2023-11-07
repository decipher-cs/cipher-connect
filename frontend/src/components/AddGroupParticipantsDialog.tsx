import {
    IconButton,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    CircularProgress,
} from '@mui/material'
import { useContext, useRef, useState } from 'react'
import { CloseRounded, DeleteRounded, DoneAllRounded, PersonAddRounded } from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { Routes } from '../types/routes'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { CredentialContext } from '../contexts/Credentials'
import { useFormik, FormikErrors } from 'formik'
import { useSocket } from '../hooks/useSocket'
import { useQuery } from '@tanstack/react-query'
import { axiosServerInstance } from '../App'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDialog } from '../hooks/useDialog'
import { userListValidation } from '../schemaValidators/yupFormValidators'
import { z } from 'zod'
import { ButtonWithLoader } from './ButtonWithLoader'

type UserList = z.infer<typeof userListValidation>

export const AddGroupParticipantsDialog = (props: { room: RoomsState['joinedRooms'][0] }) => {
    const { dialogOpen, handleClose, handleOpen } = useDialog()

    const socket = useSocket()

    const {
        handleSubmit,
        formState: { errors, isSubmitting, isValidating, isDirty },
        control,
        register,
        reset,
    } = useForm<UserList>({
        defaultValues: {
            usernames: [{ username: '' }],
        },
        resolver: zodResolver(userListValidation),
    })

    const { append, remove, fields } = useFieldArray({ name: 'usernames', control })

    const submitUserList: SubmitHandler<UserList> = ({ usernames }) => {
        const uniqueUsers = new Set(usernames.map(({ username }) => username))
        const usernameArray = Array.from(uniqueUsers)
        socket.emit('userJoinedRoom', props.room.roomId, usernameArray)
    }

    return (
        <>
            <IconButton onClick={handleOpen}>
                <PersonAddRounded />
            </IconButton>
            <Dialog open={dialogOpen} onClose={handleClose} fullWidth>
                <DialogTitle>
                    Add members to group
                    <Button onClick={() => append({ username: '' })}>Add More</Button>
                </DialogTitle>

                <DialogContent>
                    {fields.map((field, i) => (
                        <StyledTextField
                            key={field.id}
                            size='small'
                            sx={{ width: '100%' }}
                            {...register(`usernames.${i}.username` as const)}
                            placeholder='Add User'
                            error={
                                errors.usernames !== undefined && errors.usernames[i]?.username?.message !== undefined
                            }
                            helperText={
                                errors.usernames &&
                                errors.usernames[i]?.username &&
                                errors.usernames[i]?.username?.message
                            }
                            InputProps={{
                                endAdornment: (
                                    <>
                                        {isDirty &&
                                            (isValidating ? (
                                                <CircularProgress size={'1rem'} />
                                            ) : errors?.usernames?.[i] ? (
                                                <CloseRounded color='error' />
                                            ) : (
                                                <DoneAllRounded color='success' />
                                            ))}
                                        <IconButton onClick={() => remove(i)}>
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
                        <Button
                            onClick={() => {
                                handleClose()
                                reset()
                            }}
                        >
                            Cancel
                        </Button>
                        <ButtonWithLoader
                            showLoader={isSubmitting}
                            type='submit'
                            variant='contained'
                            disabled={isSubmitting || isValidating}
                            onClick={() => {
                                handleSubmit(submitUserList)().then(() => handleClose())
                            }}
                        >
                            Confirm
                        </ButtonWithLoader>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    )
}
