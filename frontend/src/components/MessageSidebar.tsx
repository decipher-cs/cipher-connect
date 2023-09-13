import { Box, Checkbox, Collapse, Divider, FormControl, List, Typography } from '@mui/material'
import { useState } from 'react'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'
import { BorderColorRounded } from '@mui/icons-material'
import { StyledTextField } from './StyledTextField'
import { Form, useFormik } from 'formik'
import { RoomActions } from '../reducer/roomReducer'
import { RoomListItem } from './RoomListItem'

interface MessageSidebarProps {
    socketObject: SocketWithCustomEvents
    roomDispatcher: React.Dispatch<RoomActions>
    rooms: RoomWithParticipants[]
    selectedRoomIndex: number | null
}

// TODO: Incorporate yup for string validation
const validateForm = (values: { user: string } | { groupDisplayName: string }) => {
    const errors: { [key: string]: string } = {}

    const input = Object.values(values)[0]
    const key = Object.keys(values)[0]

    if (input.length < 3) {
        errors[key] = 'Minimum 3 characters needed'
    } else if (input.length > 50) {
        errors[key] = 'Maximum 50 characters allowed'
    }

    return errors
}

export const MessageSidebar = (props: MessageSidebarProps) => {
    const [showTextFields, setShowTextFields] = useState(true)

    const formikAddUser = useFormik({
        initialValues: { user: '' },
        validate: validateForm,
        onSubmit: async ({ user }) => {
            props.socketObject.emit('createNewPrivateRoom', user.trim(), response => {
                response && formikAddUser.setFieldError('user', response)
            })
        },
    })
    const formikCreateGroup = useFormik({
        initialValues: { groupDisplayName: '' },
        validate: validateForm,
        onSubmit: async ({ groupDisplayName }) => {
            props.socketObject.emit('createNewGroup', [], groupDisplayName.trim(), response => {
                response && formikCreateGroup.setFieldError('groupDisplayName', response)
            })
        },
    })

    return (
        <Box
            sx={{
                flexShrink: 0,
                flexGrow: 0,

                display: 'grid',
                alignContent: 'flex-start',
            }}
        >
            <Typography pl={2} display={'inline'} sx={{ gridArea: '1 / 1 / 1 / 1', alignSelf: 'center' }}>
                Messages
            </Typography>

            <Checkbox
                icon={<BorderColorRounded />}
                checkedIcon={<BorderColorRounded />}
                onClick={() => {
                    setShowTextFields(prev => !prev)
                }}
                sx={{ justifySelf: 'flex-end', gridArea: '1 / 1 / 1 / 1', pr: 2 }}
            />

            <Collapse in={showTextFields}>
                <Divider sx={{ mb: 2 }} />
                <form onSubmit={formikAddUser.handleSubmit}>
                    <StyledTextField
                        sx={{ px: 1 }}
                        size='small'
                        placeholder='Add User'
                        helperText={formikAddUser.touched.user && formikAddUser.errors.user}
                        error={formikAddUser.errors.user !== undefined && formikAddUser.touched.user}
                        {...formikAddUser.getFieldProps('user')}
                    />
                </form>
                <Typography align='center' variant='body2'>
                    OR
                </Typography>

                <form onSubmit={formikCreateGroup.handleSubmit}>
                    <StyledTextField
                        sx={{ px: 1 }}
                        size='small'
                        helperText={
                            formikCreateGroup.touched.groupDisplayName && formikCreateGroup.errors.groupDisplayName
                        }
                        placeholder='Create Group'
                        error={
                            formikCreateGroup.errors.groupDisplayName !== undefined &&
                            formikCreateGroup.touched.groupDisplayName
                        }
                        {...formikCreateGroup.getFieldProps('groupDisplayName')}
                    />
                </form>
            </Collapse>

            <List sx={{ overflowY: 'auto' }}>
                {props.rooms.map((room, i) => {
                    return (
                        <RoomListItem
                            key={i}
                            currentRoomIndex={i}
                            selectedRoomIndex={props.selectedRoomIndex}
                            room={room}
                            roomDispatcher={props.roomDispatcher}
                        />
                    )
                })}
            </List>
        </Box>
    )
}
