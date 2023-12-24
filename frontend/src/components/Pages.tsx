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
import { Box, CircularProgress, Container, LinearProgress, Typography } from '@mui/material'
import { Chat } from '../pages/Chat'
import { User } from '../types/prisma.client'

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

    return (
        <>
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
