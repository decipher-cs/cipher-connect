import styled from '@emotion/styled'
import {
    ChatBubbleRounded,
    ContactMailRounded,
    GitHub,
    LogoutRounded,
    SettingsSuggestRounded,
} from '@mui/icons-material'
import { Avatar, Box, ButtonGroup, IconButton, Switch, SxProps, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GridLoader, MoonLoader } from 'react-spinners'
import { CredentialContext } from '../contexts/Credentials'
import { useFetch } from '../hooks/useFetch'
import { User, UserWithoutID } from '../types/prisma.client'
import { Routes } from '../types/routes'
import { SocketWithCustomEvents } from '../types/socket'
import { DarkModeToggleSwitch } from './DarkModeToggleSwitch'
import { ProfileSettingsDialog } from './ProfileSettingsDialog'

interface SidebarProps {
    sx?: SxProps | undefined
    socketObject: SocketWithCustomEvents
    // userSettings: Settings
    // setUserSettings: React.Dispatch<React.SetStateAction<Settings>>
}

export const Sidebar = (props: SidebarProps) => {
    const navigate = useNavigate()

    const [dialogOpen, setDialogOpen] = useState(false)

    const { username } = useContext(CredentialContext)

    const [userProfile, setUserProfile] = useState<UserWithoutID>({
        username,
        createTime: new Date(),
        displayName: username,
        avatarPath: null,
    })

    useFetch<UserWithoutID>(Routes.get.user, false, username, undefined, data => {
        setUserProfile(data)
    })

    if (!userProfile || !setUserProfile) return <MoonLoader />

    const avatarURL = userProfile.avatarPath ? import.meta.env.VITE_AVATAR_STORAGE_URL + userProfile.avatarPath : ''

    return (
        <Box sx={{ ...props.sx, display: 'grid', justifyItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title='Profile'>
                    <IconButton sx={{ justifySelf: 'center' }} onClick={() => setDialogOpen(true)}>
                        <Avatar src={avatarURL} />
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

            {setUserProfile !== undefined ? (
                <ProfileSettingsDialog
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    socketObject={props.socketObject}
                    setUserProfile={setUserProfile}
                    userProfile={userProfile}
                />
            ) : null}

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
