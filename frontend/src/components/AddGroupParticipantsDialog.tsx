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
import { useSocket } from '../hooks/useSocket'

export const AddGroupParticipantsDialog = (props: { room: RoomsState['joinedRooms'][0] }) => {
    const { username } = useContext(CredentialContext)

    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => setIsOpen(false)

    const socket = useSocket()

    const { startFetching: varifyUsername } = useFetch<boolean>(Routes.get.isUsernameValid, true)

    const handleSubmit = async ({ usersToBeAdded }: { usersToBeAdded: string[] }) => {
        socket.emit('userJoinedRoom', props.room.roomId, usersToBeAdded)
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
