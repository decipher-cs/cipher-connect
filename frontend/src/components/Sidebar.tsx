import {
    ChatBubbleRounded,
    ContactMailRounded,
    GitHub,
    LogoutRounded,
    SettingsSuggestRounded,
    TryRounded,
} from '@mui/icons-material'
import {
    Avatar,
    Box,
    ButtonGroup,
    CircularProgress,
    Divider,
    IconButton,
    Switch,
    SxProps,
    Tab,
    Tabs,
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

interface SidebarProps {
    selectedTab: 'messages' | 'favourates' | 'settings'
    handleTabChange: (newTab: 'messages' | 'favourates' | 'settings') => void
}

export const Sidebar = ({ selectedTab, handleTabChange }: SidebarProps) => {
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
        <Box sx={{ display: 'grid', justifyItems: 'center', width: '7%', flexShrink: 0 }}>
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
            </Box>

            <ProfileSettingsDialog dialogOpen={dialogOpen} handleClose={handleClose} userProfile={userProfile} />

            <Tabs
                orientation='vertical'
                value={selectedTab}
                onChange={(_, val) => {
                    handleTabChange(val)
                }}
            >
                <Tab label='' value='messages' icon={<ChatBubbleRounded />} />
                <Tab label='' value='favourates' icon={<TryRounded />} />
                <Divider variant='middle' />
                <Tab label='' value='settings' icon={<SettingsSuggestRounded />} />
                <Divider variant='middle' />
                <Tab label='' value='about' icon={<ContactMailRounded />} onClick={() => navigate('/about')} />
                <Tab label='' value='logout' icon={<LogoutRounded />} onClick={() => navigate('/logout')} />
            </Tabs>

            <Box sx={{ display: 'grid', alignContent: 'flex-end', gap: 3 }}>
                <Tooltip placement='right' title='Source code'>
                    <IconButton
                        sx={{ justifySelf: 'center' }}
                        href='https://github.com/decipher-cs/cipher-connect'
                        target='_blank'
                    >
                        <GitHub />
                    </IconButton>
                </Tooltip>
                <ThemeToggleSwitch sx={{ alignSelf: 'flex-end' }} />
            </Box>
        </Box>
    )
}
