import {
    ChatBubbleRounded,
    ContactMailRounded,
    GitHub,
    LogoutRounded,
    SettingsSuggestRounded,
} from '@mui/icons-material'
import {
    Avatar,
    Box,
    ButtonGroup,
    CircularProgress,
    IconButton,
    Switch,
    SxProps,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import { User, UserWithoutID } from '../types/prisma.client'
import { Routes } from '../types/routes'
import { ProfileSettingsDialog } from './ProfileSettingsDialog'
import { useQuery, useMutation, useQueries } from '@tanstack/react-query'
import axios from 'axios'
import { useDialog } from '../hooks/useDialog'
import { axiosServerInstance } from '../App'
import { ThemeToggleSwitch } from './ThemeToggleSwitch'
import { useAuth } from '../hooks/useAuth'

interface SidebarProps {}

export const Sidebar = (props: SidebarProps) => {
    const navigate = useNavigate()

    const { dialogOpen, handleOpen, handleClose } = useDialog()

    const {
        authStatus: { username, isLoggedIn },
    } = useAuth()

    const { data: userProfile } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => axiosServerInstance.get<UserWithoutID>(Routes.get.user + `/${username}`).then(res => res.data),
    })

    const [selectedItem, setSelectedItem] = useState('chat')

    const handleSelectedItemChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, value: string) =>
        setSelectedItem(value)

    if (!userProfile) return <CircularProgress />

    const avatarURL = userProfile.avatarPath

    return (
        <Box sx={{ display: 'grid', justifyItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Tooltip placement='right' title='Profile'>
                    <>
                        <IconButton sx={{ justifySelf: 'center' }} onClick={handleOpen}>
                            <Avatar src={avatarURL ?? ''} />
                        </IconButton>
                        <Typography variant='caption' textOverflow='ellipsis'>
                            {username}
                        </Typography>
                    </>
                </Tooltip>

                <Tooltip placement='right' title='Source code'>
                    <IconButton
                        sx={{ justifySelf: 'center' }}
                        href='https://github.com/decipher-cs/cipher-connect'
                        target='_blank'
                    >
                        <GitHub />
                    </IconButton>
                </Tooltip>
            </Box>

            <ProfileSettingsDialog dialogOpen={dialogOpen} handleClose={handleClose} userProfile={userProfile} />

            <ToggleButtonGroup
                orientation='vertical'
                sx={{ alignSelf: 'center' }}
                exclusive
                value={selectedItem}
                onChange={handleSelectedItemChange}
            >
                <ToggleButton value='chat' onClick={() => navigate('/chat')}>
                    <Tooltip placement='right' title='chat'>
                        <ChatBubbleRounded />
                    </Tooltip>
                </ToggleButton>

                <ToggleButton value='setting' onClick={handleOpen}>
                    <Tooltip placement='right' title='settings'>
                        <SettingsSuggestRounded />
                    </Tooltip>
                </ToggleButton>

                <ToggleButton value='about' onClick={() => navigate('/about')}>
                    <Tooltip placement='right' title='about'>
                        <ContactMailRounded />
                    </Tooltip>
                </ToggleButton>

                <ToggleButton value='logout' onClick={() => navigate('/logout')}>
                    <Tooltip placement='right' title='logout'>
                        <LogoutRounded />
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
            <ThemeToggleSwitch sx={{ alignSelf: 'flex-end' }} />
        </Box>
    )
}
