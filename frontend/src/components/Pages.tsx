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

export const Pages = () => {
    const {
        authoriseUser,
        authStatus: { isLoggedIn },
    } = useAuth()

    const { status, data: username } = useQuery({
        queryKey: ['login-status'],
        queryFn: () =>
            axiosServerInstance
                .get<string>(ApiRoutes.get.sessionStatus)
                .then(res => res.data)
                .catch(reason => console.log('reason is:', reason)),
        retry: false,
    })

    useEffect(() => {
        if (status === 'success' && username) authoriseUser(username)
    }, [username])

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
                background: theme => {
                    if (theme.palette.mode === 'light')
                        return 'linear-gradient(135deg, #f4e9e5,#f4dcd0,#eed0d2,#dbd7e4,#e4e8f2)'
                    const size = '30px'
                    const loopColor = theme.palette.background.default
                    const loop = `#0000 46%, ${loopColor} 47% 53%, #0000 54%`

                    return `radial-gradient(100% 100% at 100% 101%, ${loop}) ${size} ${size},
                                            radial-gradient(100% 100% at 0 0, ${loop}) ${size} ${size},
                                    radial-gradient(100% 100%, ${theme.palette.background.dark} 22%, ${loopColor} 23% 29%, ${theme.palette.background.dark} 30% 34%, ${loopColor} 35% 41%, #0000 42%) ${theme.palette.background.dark}`
                },
                backgroundSize: theme => {
                    if (theme.palette.mode === 'light') return
                    const size = 30
                    return `${size * 2}px ${size * 2}px`
                },
            }}
        >
            <Typography variant='subtitle2'>Checking Login Status...</Typography>
            <LinearProgress color='primary' />
        </Box>
    )
}
