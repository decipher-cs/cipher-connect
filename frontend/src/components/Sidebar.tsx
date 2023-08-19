import styled from '@emotion/styled'
import {
    ChatBubbleRounded,
    ContactMailRounded,
    GitHub,
    LogoutRounded,
    SettingsSuggestRounded,
} from '@mui/icons-material'
import { Avatar, Box, ButtonGroup, IconButton, Switch, SxProps, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { imageBufferToURLOrEmptyString } from '../pages/Chat'
import { Settings, SocketWithCustomEvents } from '../types/socket'
import { DarkModeToggleSwitch } from './DarkModeToggleSwitch'
import { ProfileSettingsDialog } from './ProfileSettingsDialog'

interface SidebarProps {
    sx?: SxProps | undefined
    socketObject: SocketWithCustomEvents
    userSettings: Settings
}

export const Sidebar = (props: SidebarProps) => {
    const navigate = useNavigate()

    const [dialogOpen, setDialogOpen] = useState(false)

    let imgURL = imageBufferToURLOrEmptyString(props.userSettings.userDisplayImage)

    return (
        <Box sx={{ ...props.sx, display: 'grid', justifyItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title='Profile'>
                    <IconButton sx={{ justifySelf: 'center' }} onClick={() => setDialogOpen(true)}>
                        <Avatar src={imgURL} />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Source code'>
                    <IconButton
                        sx={{ justifySelf: 'center' }}
                        href='https://github.com/decipher-cs/cipher-connect'
                        target='_blank'
                    >
                        <GitHub />
                    </IconButton>
                </Tooltip>
            </Box>

            <ProfileSettingsDialog
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                socketObject={props.socketObject}
                userSettings={props.userSettings}
            />

            <ButtonGroup orientation='vertical' sx={{ alignSelf: 'center' }}>
                <IconButton onClick={() => navigate('/chat')}>
                    <ChatBubbleRounded />
                </IconButton>

                <IconButton onClick={() => setDialogOpen(true)}>
                    <SettingsSuggestRounded />
                </IconButton>

                <IconButton onClick={() => navigate('/about')}>
                    <ContactMailRounded />
                </IconButton>

                <IconButton onClick={() => navigate('/logout')}>
                    <LogoutRounded />
                </IconButton>
            </ButtonGroup>
            <DarkModeToggleSwitch sx={{ alignSelf: 'flex-end' }} />
        </Box>
    )
}
