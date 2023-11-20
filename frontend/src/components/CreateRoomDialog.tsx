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
    Stack,
    ToggleButton,
    ToggleButtonGroup,
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
import { roomCreationFormValidation } from '../schemaValidators/yupFormValidators'
import { ButtonWithLoader } from './ButtonWithLoader'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const MAX_ALLOWED_USERS_IN_PRIVATE_ROOM = 1

interface CreateRoomDialogProps {
    dialogOpen: boolean
    roomDispatcher: React.Dispatch<RoomActions>
    handleClose: () => void
}

type CreateRoomFormValues = z.infer<typeof roomCreationFormValidation>

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
    } = useForm<CreateRoomFormValues>({
        defaultValues: {
            roomType: RoomType.group,
            roomDisplayName: '',
            participants: [{ username: '' }],
        } satisfies CreateRoomFormValues,
        resolver: zodResolver(roomCreationFormValidation),
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'participants' })

    const handleFormSubmit: SubmitHandler<CreateRoomFormValues> = ({ participants, roomType, roomDisplayName }) => {
        const uniqueUsernamesSet = new Set(participants.map(({ username }) => username))
        const uniqueUsernames = [...uniqueUsernamesSet]

        if (roomType === RoomType.private) {
            const username = participants.at(0)?.username
            if (username) socket.emit('newRoomCreated', { roomType: RoomType.private, participant: username })
        } else if (roomType === RoomType.group) {
            socket.emit('newRoomCreated', {
                roomType: RoomType.group,
                participants: uniqueUsernames,
                displayName: roomDisplayName,
                avatarPath: null,
            })
        }
        reset()
        handleClose()
    }

    return (
        <Dialog open={dialogOpen} scroll='paper' onClose={handleClose} fullWidth>
            <DialogTitle>Create a new room</DialogTitle>

            <DialogContent dividers>
                <Stack component={'form'} id='create-room' onSubmit={handleSubmit(handleFormSubmit)} spacing={2}>
                    <ToggleButtonGroup
                        value={getValues('roomType')}
                        onChange={_ => {
                            setValue(
                                'roomType',
                                watch('roomType') === RoomType.private ? RoomType.group : RoomType.private
                            )
                        }}
                    >
                        <ToggleButton value='group'>Group</ToggleButton>
                        <ToggleButton value='private'>Private</ToggleButton>
                    </ToggleButtonGroup>

                    <StyledTextField
                        label='Group Name'
                        disabled={getValues('roomType') === RoomType.private}
                        helperText={errors.roomDisplayName !== undefined && errors.roomDisplayName.message}
                        error={errors.roomDisplayName !== undefined && getValues('roomType') === RoomType.group}
                        {...register('roomDisplayName')}
                    />

                    {/* <List disablePadding dense> */}
                    <List disablePadding>
                        <ListSubheader
                            sx={{
                                // background: 'transparent',
                                border: 'solid 1px red',
                                // alignItems: 'center',
                                // justifyContent: 'space-between',
                                placeItems: 'center',
                                placeContent: 'center',
                            }}
                        >
                            <span>Participants</span>
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
                                disableGutters
                                // disablePadding
                                key={username.id}
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
                                    variant='standard'
                                    disabled={
                                        getValues('roomType') === RoomType.private &&
                                        getValues('participants').length >= MAX_ALLOWED_USERS_IN_PRIVATE_ROOM &&
                                        i >= MAX_ALLOWED_USERS_IN_PRIVATE_ROOM
                                    }
                                    helperText={errors.participants?.[i]?.username?.message ?? ''}
                                    error={errors?.participants?.[i] !== undefined}
                                    {...register(`participants.${i}.username`)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Stack>
            </DialogContent>

            <DialogActions>
                <ButtonGroup variant='outlined'>
                    <Button
                        onClick={() => {
                            reset()
                            handleClose()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={() => reset()}>Clear</Button>
                    <ButtonWithLoader
                        showLoader={isSubmitting}
                        type='submit'
                        form='create-room'
                        variant='contained'
                        disabled={isSubmitting || isValidating}
                    >
                        submit
                    </ButtonWithLoader>
                </ButtonGroup>
            </DialogActions>
        </Dialog>
    )
}
