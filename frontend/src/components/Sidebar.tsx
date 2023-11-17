import {
    ChatBubbleRounded,
    ContactMailRounded,
    GitHub,
    LogoutRounded,
    SettingsSuggestRounded,
} from '@mui/icons-material'
import { Avatar, Box, ButtonGroup, CircularProgress, IconButton, Switch, SxProps, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CredentialContext } from '../contexts/Credentials'
import { useSocket } from '../hooks/useSocket'
import { User, UserWithoutID } from '../types/prisma.client'
import { Routes } from '../types/routes'
import { ProfileSettingsDialog } from './ProfileSettingsDialog'
import { useQuery, useMutation, useQueries } from '@tanstack/react-query'
import axios from 'axios'
import { useDialog } from '../hooks/useDialog'
import { axiosServerInstance } from '../App'
import { ThemeToggleSwitch } from './ThemeToggleSwitch'

interface SidebarProps {}

export const Sidebar = (props: SidebarProps) => {
    const navigate = useNavigate()

    const { dialogOpen, handleOpen, handleClose } = useDialog()

    const { username } = useContext(CredentialContext)

    const { data: userProfile } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => axiosServerInstance.get<UserWithoutID>(Routes.get.user + `/${username}`).then(res => res.data),
    })

    if (!userProfile) return <CircularProgress />

    const avatarURL = userProfile.avatarPath

    return (
        <Box sx={{ display: 'grid', justifyItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip placement='right' title='Profile'>
                    <IconButton sx={{ justifySelf: 'center' }} onClick={handleOpen}>
                        <Avatar src={avatarURL ?? ''} />
                    </IconButton>
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

            <ButtonGroup orientation='vertical' sx={{ alignSelf: 'center' }}>
                <Tooltip placement='right' title='chat'>
                    <IconButton onClick={() => navigate('/chat')}>
                        <ChatBubbleRounded />
                    </IconButton>
                </Tooltip>

                <Tooltip placement='right' title='settings'>
                    <IconButton onClick={handleOpen}>
                        <SettingsSuggestRounded />
                    </IconButton>
                </Tooltip>

                <Tooltip placement='right' title='about'>
                    <IconButton onClick={() => navigate('/about')}>
                        <ContactMailRounded />
                    </IconButton>
                </Tooltip>

                <Tooltip placement='right' title='logout'>
                    <IconButton onClick={() => navigate('/logout')}>
                        <LogoutRounded />
                    </IconButton>
                </Tooltip>
            </ButtonGroup>
            <ThemeToggleSwitch sx={{ alignSelf: 'flex-end' }} />
        </Box>
    )
}
