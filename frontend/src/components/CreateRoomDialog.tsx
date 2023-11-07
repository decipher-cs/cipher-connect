import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    ListItem,
    ListSubheader,
} from '@mui/material'
import { List } from '@mui/material'
import { RoomType, User } from '../types/prisma.client'
import { DeleteRounded, DoneAllRounded } from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { RoomActions } from '../reducer/roomReducer'
import { useSocket } from '../hooks/useSocket'
import { ButtonSwitch } from './styled/ButtonSwitch'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { newRoomFormValidation } from '../schemaValidators/yupFormValidators'
import { ButtonWithLoader } from './ButtonWithLoader'

const MAX_ALLOWED_USERS_IN_PRIVATE_ROOM = 1

interface CreateRoomDialogProps {
    dialogOpen: boolean
    roomDispatcher: React.Dispatch<RoomActions>
    handleClose: () => void
}

export type InitialFormValues = {
    roomType: RoomType
    roomDisplayName: string
    participants: { username: User['username'] }[]
}

export const CreateRoomDialog = ({ dialogOpen, handleClose }: CreateRoomDialogProps) => {
    const socket = useSocket()

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValidating, isSubmitting },
        control,
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            roomType: RoomType.group,
            roomDisplayName: '',
            participants: [{ username: '' }],
        } as InitialFormValues,
        resolver: yupResolver(newRoomFormValidation),
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'participants' })

    const handleFormSubmit: SubmitHandler<InitialFormValues> = () => {
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
                                prefix='foobar_remove_c325s'
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
                        <ButtonWithLoader
                            showLoader={isSubmitting}
                            type='submit'
                            variant='contained'
                            disabled={isSubmitting || isValidating}
                        >
                            submit
                        </ButtonWithLoader>
                    </ButtonGroup>
                </DialogActions>
            </form>
        </Dialog>
    )
}
