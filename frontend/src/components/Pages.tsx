import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './RequireAuth'
import { SocketContextProvider } from '../contexts/Socket'
import { Login } from '../pages/Login'
import { About } from '../pages/About'
import { Logout } from '../pages/Logout'
import { useQuery } from '@tanstack/react-query'
import { axiosServerInstance } from '../App'
import { Routes as ApiRoutes } from '../types/routes'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Snackbar,
    Typography,
} from '@mui/material'
import { Chat } from '../pages/Chat'
import { User } from '../types/prisma.client'
import { useToast } from '../hooks/useToast'
import { CancelRounded } from '@mui/icons-material'

export const Pages = () => {
    const { authoriseUser } = useAuth()

    // Make a get request to server to check if the user already has a valid session or not.
    const { status, data: user } = useQuery({
        queryKey: ['session-status'],
        queryFn: () =>
            axiosServerInstance.get<User>(ApiRoutes.get.sessionStatus).then(res => {
                if (res.status === 201) return res.data
                else throw new Error('Server responded with wrong data type for username.')
            }),
        retry: false,
    })

    useEffect(() => {
        if (status === 'success' && user) {
            authoriseUser(user.username, user)
        }
    }, [user, status])

    useEffect(() => {
        const onOnline = () => notify('Connection found', 'success')
        const onOffline = () => notify('Connection lost', 'warning')

        window.addEventListener('offline', onOffline)
        window.addEventListener('online', onOnline)

        // ping server
        const intervalTimeInSec = import.meta.env.DEV ? 60 : 120
        const abortController = new AbortController()

        const interval = setInterval(() => {
            axiosServerInstance
                .get(ApiRoutes.all.healthCheck, { retry: 1, signal: abortController.signal })
                .catch(() => {
                    notify('Server unreachable', 'warning')
                })
        }, 1000 * intervalTimeInSec)

        return () => {
            clearInterval(interval)
            abortController.abort()
            window.removeEventListener('offline', onOffline)
            window.removeEventListener('online', onOnline)
        }
    }, [])

    const { snackbarControllProps, alertControllProps, message, notify } = useToast()

    return (
        <>
            <Snackbar {...snackbarControllProps} autoHideDuration={10000}>
                <Alert {...alertControllProps} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

            <BrowserRouter>
                <Routes>
                    <Route
                        path='/chat'
                        element={
                            status === 'loading' ? (
                                <Loader />
                            ) : (
                                <RequireAuth>
                                    <SocketContextProvider>
                                        <Chat />
                                    </SocketContextProvider>
                                </RequireAuth>
                            )
                        }
                    />
                    <Route path='/login' element={<Login />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/logout' element={<Logout />} />
                    <Route path='*' element={<Navigate to='/chat' replace />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

const Loader = () => {
    return (
        <Box
            sx={{
                display: 'grid',
                height: '100svh',
                width: '100vw',
                alignContent: 'center',
                justifyContent: 'center',
                background: theme => theme.design.background,
                backgroundSize: theme => (theme.palette.mode === 'dark' ? theme.design.backgroundSize : null),
            }}
        >
            <Typography variant='subtitle2'>Checking Login Status...</Typography>
            <LinearProgress color='primary' />
        </Box>
    )
}
