import * as React from 'react'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { Container, TextField } from '@mui/material'
import { useState } from 'react'
import { ClientToServerEvents } from '../types/socket'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />
})

// This is the type of callback parameters in socket.emit('eventName', args, callback)
type ErrorStatusOnPrivateRoom = Parameters<Parameters<ClientToServerEvents['createNewPrivateRoom']>[1]>[0]
type ErrorStatusOnGroup = Parameters<Parameters<ClientToServerEvents['createNewGroup']>[2]>[0]

interface AddRoomProps {
    keyDownActionAddRoom: (newUser: string) => Promise<ErrorStatusOnPrivateRoom | undefined>
    keyDownActionAddGroup: (newGroupName: string) => Promise<ErrorStatusOnGroup | undefined>
}

// export default function FullScreenDialog() {
export default function AddRoom(props: AddRoomProps) {
    const [open, setOpen] = React.useState(false)

    const [newUserUsername, setNewUserUsername] = useState('')

    const [newUserUsernameErrorStatus, setNewUserUsernameErrorStatus] = useState({ error: false, errorDesc: '' })

    const [newGroupName, setNewGroupName] = useState('')

    const [newGroupNameErrorStatus, setNewGroupNameErrorStatus] = useState({ error: false, errorDesc: '' })

    const handleClickOpen = () => setOpen(true)

    const handleClose = () => setOpen(false)

    return (
        <span>
            <IconButton aria-label='open-menu' onClick={handleClickOpen}>
                <GroupAddIcon />
            </IconButton>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
                            Add user/ group
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container>
                    <TextField
                        onKeyDown={async e => {
                            if (e.key.toLowerCase() === 'enter') {
                                const error = await props.keyDownActionAddRoom(newUserUsername)
                                if (error !== null && error !== undefined) {
                                    setNewUserUsernameErrorStatus({ error: true, errorDesc: error })
                                } else setNewUserUsernameErrorStatus({ error: false, errorDesc: '' })
                            }
                        }}
                        error={newUserUsernameErrorStatus.error}
                        helperText={newUserUsernameErrorStatus.errorDesc}
                        value={newUserUsername}
                        onChange={e => setNewUserUsername(e.target.value)}
                        placeholder='enter username to add to list'
                    />
                    <TextField
                        onKeyDown={async e => {
                            if (e.key.toLowerCase() === 'enter') {
                                const error = await props.keyDownActionAddGroup(newUserUsername)
                                if (error !== null && error !== undefined) {
                                    setNewGroupNameErrorStatus({ error: true, errorDesc: error })
                                } else setNewGroupNameErrorStatus({ error: false, errorDesc: '' })
                            }
                        }}
                        error={newGroupNameErrorStatus.error}
                        helperText={newGroupNameErrorStatus.errorDesc}
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder='enter group name to add to list'
                    />
                </Container>
            </Dialog>
        </span>
    )
}
