import { Avatar, Box, Button, ButtonGroup, IconButton, SxProps, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, SocketWithCustomEvents } from '../types/socket'
import { ProfileSettingsDialog } from './ProfileSettingsDialog'

interface SidebarProps {
    sx?: SxProps | undefined
    socketObject: SocketWithCustomEvents
    userSettings: Settings
}

const Sidebar = (props: SidebarProps) => {
    const navigate = useNavigate()

    const [dialogOpen, setDialogOpen] = useState(false)

    let imgURL = (() => {
        if (props.userSettings.userDisplayImage === null) return ''
        const imgBuffer = props.userSettings.userDisplayImage
        const imageFile = new File([imgBuffer], 'userAvatar')
        return URL.createObjectURL(imageFile)
    })()

    return (
        <Box sx={{ ...props.sx, display: 'grid' }}>
            <Tooltip title='Profile'>
                <IconButton sx={{ justifySelf: 'center' }} onClick={() => setDialogOpen(true)}>
                    <Avatar src={imgURL} />
                </IconButton>
            </Tooltip>
            <Typography variant='subtitle1'>{props.userSettings.userDisplayName}</Typography>

            <ProfileSettingsDialog
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                socketObject={props.socketObject}
                userSettings={props.userSettings}
            />

            <ButtonGroup orientation='vertical'>
                <Button onClick={() => navigate('/chat')}>Chat</Button>

                <Button onClick={() => setDialogOpen(true)}>Profile Settings</Button>

                <Button onClick={() => navigate('/logout')}>Logout</Button>

                <Button onClick={() => navigate('/about')}>About</Button>

                <Button>Toggle Theme</Button>
            </ButtonGroup>
        </Box>
    )
}

export default Sidebar
