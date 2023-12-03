import {
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    ListItem,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import { List } from '@mui/material'
import { RoomType, User } from '../types/prisma.client'
import { CloseRounded, DeleteRounded, DoneAllRounded, NoAccountsRounded } from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { RoomActions } from '../reducer/roomReducer'
import { useSocket } from '../hooks/useSocket'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
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

    const defaultValues = {
        roomType: RoomType.group,
        roomDisplayName: '',
        participants: [{ username: '' }],
    } satisfies CreateRoomFormValues

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValidating, isSubmitting, touchedFields },
        control,
        setValue,
        getValues,
    } = useForm<CreateRoomFormValues>({
        defaultValues,
        resolver: zodResolver(roomCreationFormValidation),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        criteriaMode: 'firstError',
        shouldUnregister: true,
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'participants' })

    const handleFormSubmit: SubmitHandler<CreateRoomFormValues> = ({ participants, roomType, roomDisplayName }) => {
        const uniqueUsernamesSet = new Set(participants.map(({ username }) => username))
        const uniqueUsernames = [...uniqueUsernamesSet]

        if (roomType === RoomType.private) {
            const member = participants.at(0)?.username
            if (member) socket.emit('newRoomCreated', { roomType: RoomType.private, participant: member })
        } else if (roomType === RoomType.group) {
            socket.emit('newRoomCreated', {
                roomType: RoomType.group,
                participants: uniqueUsernames,
                displayName: roomDisplayName,
                avatarPath: null,
            })
        }
        reset(defaultValues)
        handleClose()
    }

    return (
        <Dialog open={dialogOpen} scroll='paper' onClose={handleClose}>
            <DialogTitle>Create a new room</DialogTitle>

            <DialogContent dividers>
                <Stack component={'form'} id='create-room' onSubmit={handleSubmit(handleFormSubmit)} spacing={4}>
                    <Box sx={{ display: 'grid', gap: 1 }}>
                        <Typography fontWeight='bold' variant='subtitle1'>
                            Room Type :
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            sx={{ pl: 2 }}
                            aria-label='room-type'
                            value={getValues('roomType')}
                            onChange={(_, value) => setValue('roomType', value)}
                            color={errors.roomType?.message ? 'error' : undefined}
                        >
                            <ToggleButton value={RoomType.group}>Group</ToggleButton>
                            <ToggleButton value={RoomType.private}>Private</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ display: 'grid', gap: 1 }}>
                        <Typography fontWeight='bold' variant='subtitle1'>
                            Group Name :
                        </Typography>
                        <StyledTextField
                            sx={{ pl: 2 }}
                            placeholder='Group Name'
                            variant='standard'
                            disabled={getValues('roomType') === RoomType.private}
                            helperText={errors?.roomDisplayName?.message ?? ' '}
                            error={errors.roomDisplayName !== undefined && getValues('roomType') === RoomType.group}
                            {...register('roomDisplayName')}
                        />
                    </Box>

                    <List dense disablePadding>
                        <Box
                            sx={{
                                background: 'transparent',
                                display: 'flex',
                                placeContent: 'space-between',
                            }}
                        >
                            <Typography fontWeight='bold' variant='subtitle1'>
                                Participants :
                            </Typography>
                            <Button
                                variant='outlined'
                                disabled={
                                    getValues('participants').length >= MAX_ALLOWED_USERS_IN_PRIVATE_ROOM &&
                                    getValues('roomType') === RoomType.private
                                }
                                onClick={() => append({ username: '' })}
                            >
                                more +
                            </Button>
                        </Box>

                        {fields.map((username, i) => (
                            <ListItem sx={{ pl: 2 }} key={username.id}>
                                <StyledTextField
                                    variant='standard'
                                    placeholder='Enter username...'
                                    disabled={
                                        getValues('roomType') === RoomType.private &&
                                        getValues('participants').length >= MAX_ALLOWED_USERS_IN_PRIVATE_ROOM &&
                                        i >= MAX_ALLOWED_USERS_IN_PRIVATE_ROOM
                                    }
                                    helperText={errors.participants?.[i]?.username?.message ?? ' '}
                                    error={errors?.participants?.[i] !== undefined}
                                    {...register(`participants.${i}.username`)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                {touchedFields?.participants?.[i]?.username === undefined ? (
                                                    <NoAccountsRounded />
                                                ) : errors.participants?.[i] ? (
                                                    <CloseRounded color='error' />
                                                ) : (
                                                    <DoneAllRounded color='success' />
                                                )}
                                                <IconButton aria-label='remove' onClick={() => remove(i)}>
                                                    <DeleteRounded />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Stack>
            </DialogContent>

            <DialogActions>
                <ButtonGroup variant='outlined'>
                    <Button
                        type='reset'
                        onClick={() => {
                            reset(defaultValues)
                            handleClose()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={() => reset()}>Clear</Button>
                    <ButtonWithLoader
                        showLoader={isValidating || isSubmitting}
                        type='submit'
                        form='create-room'
                        variant='contained'
                        disabled={isValidating || isSubmitting}
                    >
                        submit
                    </ButtonWithLoader>
                </ButtonGroup>
            </DialogActions>
        </Dialog>
    )
}
