import * as React from 'react'
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

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />
})

interface AddRoomProps {
    keyDownActionAddRoom: (e: React.KeyboardEvent<HTMLDivElement>, newUser: string) => void
    keyDownActionAddGroup: (e: React.KeyboardEvent<HTMLDivElement>, newGroupName: string) => void
}

// export default function FullScreenDialog() {
export default function AddRoom(props: AddRoomProps) {
    const [open, setOpen] = React.useState(false)

    const [newUserUsername, setNewUserUsername] = useState('')

    const [newGroupName, setNewGroupName] = useState('')

    const handleClickOpen = () => setOpen(true)

    const handleClose = () => setOpen(false)

    return (
        <div>
            <Button variant='outlined' onClick={handleClickOpen}>
                Open full-screen dialog
            </Button>
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
                        onKeyDown={e => props.keyDownActionAddRoom(e, newUserUsername)}
                        value={newUserUsername}
                        onChange={e => setNewUserUsername(e.target.value)}
                        helperText='Add new user'
                    />
                    <TextField
                        onKeyDown={e => props.keyDownActionAddGroup(e, newGroupName)}
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        helperText='Add new group'
                    />
                </Container>
            </Dialog>
        </div>
    )
}
