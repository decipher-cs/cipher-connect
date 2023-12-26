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
import { Navigate, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import { User } from '../types/prisma.client'
import { Routes } from '../types/routes'
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

    const {
        authStatus: { username, isLoggedIn, userDetails },
    } = useAuth()

    if (!isLoggedIn || !userDetails) return <Navigate to='/login' />

    const avatarURL = userDetails.avatarPath

    return (
        <Box sx={{ display: 'grid', justifyItems: 'center', width: '7%', flexShrink: 0, flexGrow: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Tooltip placement='right' title='Profile'>
                    <>
                        <IconButton sx={{ justifySelf: 'center' }} onClick={() => handleTabChange('settings')}>
                            <Avatar src={avatarURL ?? ''} />
                        </IconButton>
                        <Typography variant='caption' textOverflow='ellipsis'>
                            {username}
                        </Typography>
                    </>
                </Tooltip>
            </Box>

            <Tabs
                orientation='vertical'
                value={selectedTab}
                onChange={(_, val) => {
                    handleTabChange(val)
                }}
                // sx={{ borderColor: 'divider' }}
            >
                <Tab label='' value='messages' icon={<ChatBubbleRounded />} />
                <Tab label='' value='favourates' icon={<TryRounded />} />
                {/* <Divider variant='middle' /> */}
                <Tab label='' value='settings' icon={<SettingsSuggestRounded />} />
                {/* <Divider variant='middle' /> */}
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
