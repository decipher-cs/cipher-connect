import {
    IconButton,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    CircularProgress,
    Stack,
} from '@mui/material'
import { useContext, useRef, useState } from 'react'
import { CloseRounded, DeleteRounded, DoneAllRounded, PersonAddRounded } from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { Routes } from '../types/routes'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
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
    const { room } = props

    const { dialogOpen, handleClose, handleOpen } = useDialog()

    const socket = useSocket()

    const {
        handleSubmit,
        formState: { errors, isSubmitting, isValidating, isDirty, touchedFields, defaultValues },
        control,
        register,
        reset,
    } = useForm<UserList>({
        defaultValues: {
            usernames: [{ username: import.meta.env.DEV ? 'password4' : '' }],
        },
        resolver: zodResolver(userListValidation),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        shouldUnregister: true,
        criteriaMode: 'firstError',
    })

    const { append, remove, fields } = useFieldArray({ name: 'usernames', control })

    const submitUserList: SubmitHandler<UserList> = ({ usernames }) => {
        const uniqueUsers = new Set(usernames.map(usernames => usernames.username))

        const usernameArray = Array.from(uniqueUsers).filter(username => !room.participants.includes(username))

        // if (usernameArray.length >= 1) socket.emit('userJoinedRoom', props.room.roomId, usernameArray)
        if (usernameArray.length >= 1)
            axiosServerInstance.post(Routes.post.participants, {
                roomId: room.roomId,
                participants: usernameArray,
            } satisfies {
                roomId: string
                participants: string[]
            })

        reset(defaultValues)

        handleClose()
    }

    return (
        <>
            <IconButton onClick={handleOpen}>
                <PersonAddRounded />
            </IconButton>
            <Dialog open={dialogOpen} onClose={handleClose}>
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 4,
                    }}
                >
                    Add members to group
                    <Button variant='outlined' onClick={() => append({ username: '' })}>
                        Add More +
                    </Button>
                </DialogTitle>

                <DialogContent dividers>
                    <Stack>
                        {fields.map((field, i) => (
                            <StyledTextField
                                key={field.id}
                                variant='standard'
                                // sx={{ width: '100%', my: 1 }}
                                {...register(`usernames.${i}.username` as const)}
                                placeholder='Enter username...'
                                error={errors.usernames?.[i]?.username?.message !== undefined}
                                helperText={errors.usernames?.[i]?.username?.message ?? ' '}
                                InputProps={{
                                    endAdornment: (
                                        <>
                                            {touchedFields?.usernames?.[i] &&
                                                (isValidating ? (
                                                    <CircularProgress size={'1rem'} />
                                                ) : errors?.usernames?.[i]?.username?.message ? (
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
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <ButtonGroup>
                        <Button
                            onClick={() => {
                                handleClose()
                                reset(defaultValues)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => reset(defaultValues)}>Reset</Button>
                        <ButtonWithLoader
                            showLoader={isSubmitting}
                            type='submit'
                            variant='contained'
                            disabled={isSubmitting || isValidating}
                            onClick={handleSubmit(submitUserList)}
                        >
                            Confirm
                        </ButtonWithLoader>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    )
}
