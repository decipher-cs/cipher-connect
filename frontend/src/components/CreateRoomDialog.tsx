import {
    Button,
    ButtonGroup,
    createTheme,
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
} from '@mui/material'
import { List } from '@mui/material'
import { useContext, useState } from 'react'
import { Room, RoomDetails, RoomType, RoomWithParticipants, User } from '../types/prisma.client'
import { BorderColorRounded, DeleteRounded, DoneAllRounded, RoomTwoTone } from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { RoomActions, RoomActionType, RoomsState } from '../reducer/roomReducer'
import { CredentialContext } from '../contexts/Credentials'
import { useSocket } from '../hooks/useSocket'
import { object, string, number, ObjectSchema, array, boolean, InferType, addMethod } from 'yup'
import { ButtonSwitch } from './styled/ButtonSwitch'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const MAX_ALLOWED_USERS_IN_PRIVATE_ROOM = 1

interface CreateRoomDialogProps {
    dialogOpen: boolean
    roomDispatcher: React.Dispatch<RoomActions>
    handleClose: () => void
}

type InitialFormValues = {
    roomType: RoomType
    roomDisplayName: string
    participants: { username: User['username'] }[]
}

// Validation schema
const roomValueValidationSchema: ObjectSchema<InitialFormValues> = object().shape({
    roomType: string()
        .default(RoomType.private)
        .oneOf([RoomType.private, RoomType.group], 'room can only be of type group or private')
        .required('This is a required value'),

    participants: array()
        .of(
            object({
                username: string()
                    .required('Cannot be empty')
                    .min(3, 'Need at least 3 characters')
                    .max(16, 'maximum 16 characters allowed')
                    .test(
                        'username-validity-testk',
                        'Username does not exist or is allowing requests',
                        async username => {
                            // TODO: check if user exists on DB
                            return true
                        }
                    ),
            })
        )
        .required('Cannot be empty')
        .when('roomType', {
            is: (type: RoomType) => type === RoomType.private,
            then: schema => schema.length(1, 'Need at least one username'),
        })
        .test('uniqueness-test', 'Duplicate username detected', values => {
            const usernames = values.map(({ username }) => username)
            return usernames.length === new Set(usernames).size
        })
        .min(1, 'Need at least one username'),

    roomDisplayName: string()
        .default('')
        .when('roomType', {
            is: (type: RoomType) => type === RoomType.group,
            then(schema) {
                return schema.required().min(3, 'Min 3 characters needed').max(16, 'Max 16 characters allowed').trim()
            },
        }),
})

export const CreateRoomDialog = ({ dialogOpen, handleClose, roomDispatcher }: CreateRoomDialogProps) => {
    const { username } = useContext(CredentialContext)

    const socket = useSocket()

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
        control,
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            roomType: RoomType.group,
            roomDisplayName: '',
            participants: [{ username: '' }],
        },
        resolver: yupResolver(roomValueValidationSchema),
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'participants' })

    const handleFormSubmit = () => {
        const usernames = getValues('participants').map(({ username }) => username)
        if (getValues('roomType') === RoomType.private) {
            socket.emit('newRoomCreated', { roomType: RoomType.private, participant: usernames[0] })
        } else if (getValues('roomType') === RoomType.group) {
            socket.emit('newRoomCreated', {
                roomType: RoomType.group,
                participants: usernames,
                displayName: getValues('roomDisplayName'),
                avatarPath: null,
            })
        }
        reset()
        handleClose()
    }

    return (
        <Dialog open={dialogOpen} scroll='paper' onClose={handleClose} fullWidth>
            <DialogTitle>Create a new room</DialogTitle>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent dividers sx={{}}>
                    <FormControlLabel
                        control={<ButtonSwitch labelWhenOff={RoomType.group} labelWhenOn={RoomType.private} />}
                        label={getValues('roomType')}
                        checked={getValues('roomType') === RoomType.private}
                        onChange={_ => {
                            setValue(
                                'roomType',
                                watch('roomType') === RoomType.private ? RoomType.group : RoomType.private
                            )
                        }}
                    />

                    <StyledTextField
                        sx={{ px: 1, my: 4 }}
                        size='small'
                        label='Group Name'
                        disabled={getValues('roomType') === RoomType.private}
                        helperText={errors.roomDisplayName !== undefined && errors.roomDisplayName.message}
                        error={errors.roomDisplayName !== undefined && getValues('roomType') === RoomType.group}
                        {...register('roomDisplayName')}
                    />

                    <List disablePadding dense>
                        <ListSubheader>
                            Participants
                            <Button
                                disabled={
                                    getValues('participants').length >= MAX_ALLOWED_USERS_IN_PRIVATE_ROOM &&
                                    getValues('roomType') === RoomType.private
                                }
                                onClick={() => append({ username: '' })}
                            >
                                add
                            </Button>
                        </ListSubheader>
                        {fields.map((username, i) => (
                            <ListItem
                                key={username.id}
                                prefix='hello world'
                                secondaryAction={
                                    <>
                                        <IconButton edge='end'>
                                            <DoneAllRounded />
                                        </IconButton>
                                        <IconButton edge='end' aria-label='remove' onClick={() => remove(i)}>
                                            <DeleteRounded />
                                        </IconButton>
                                    </>
                                }
                            >
                                <StyledTextField
                                    size='small'
                                    variant='standard'
                                    disabled={
                                        getValues('roomType') === RoomType.private &&
                                        getValues('participants').length >= MAX_ALLOWED_USERS_IN_PRIVATE_ROOM &&
                                        i >= MAX_ALLOWED_USERS_IN_PRIVATE_ROOM
                                    }
                                    helperText={
                                        errors.participants !== undefined &&
                                        (errors.participants?.root?.message ||
                                            errors.participants[i]?.username?.message)
                                    }
                                    error={errors.participants !== undefined}
                                    {...register(`participants.${i}.username`)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>

                <DialogActions>
                    <ButtonGroup variant='outlined'>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => reset()}>Clear</Button>
                        <Button variant='contained' type='submit'>
                            Submit
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </form>
        </Dialog>
    )
}
