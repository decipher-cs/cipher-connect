import { Avatar, Box, Button, ButtonGroup, SxProps } from '@mui/material'
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

    const [dialogOpen, setDialogOpen] = useState(true)

    return (
        <Box sx={{ ...props.sx, display: 'grid' }}>
            <Avatar sx={{ justifySelf: 'center' }} src='https://www.theventuretours.com/wp-content/uploads/2020/03/avatar-icon-png-1.png'/>


            <ProfileSettingsDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} socketObject={props.socketObject} userSettings={props.userSettings}/>

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
