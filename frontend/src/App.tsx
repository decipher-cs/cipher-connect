import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth'
import { CredentialContext, CredentialContextProvider } from './contexts/Credentials'
import { Chat } from './pages/Chat'
import { About } from './pages/About'
import { Login } from './pages/Login'
import { Logout } from './pages/Logout'
import { Routes as ApiRoutes } from './types/routes'
import { SocketContextProvider } from './contexts/Socket'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import { useThemeToggle } from './hooks/useThemeToggle'
import { darkTheme } from './theme/darkTheme'
import { ThemeContext } from './contexts/ThemeModeContextProvider'

const TempUsernameDisplay = () => {
    const { username, handleCredentialChange, isLoggedIn } = useContext(CredentialContext)

    useEffect(() => {
        const username = window.localStorage.getItem('username')

        if (username === null) return

        const varifyUser = async () => {
            const response = await axiosServerInstance.post(ApiRoutes.varifyRefreshToken, { username })

            if (response.statusText === 'OK') {
                const verifiedUsername: { username: string } = response.data
                handleCredentialChange({ username: verifiedUsername.username, isLoggedIn: true })
            }
        }

        varifyUser()
    }, [])

    return null
}

export const queryClient = new QueryClient()

export const axiosServerInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
})

const App = () => {
    const { theme } = useContext(ThemeContext)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <QueryClientProvider client={queryClient}>
                    <ReactQueryDevtools />
                    <CredentialContextProvider>
                        <BrowserRouter>
                            <TempUsernameDisplay />

                            <Routes>
                                <Route path='/login' element={<Login />} />
                                <Route
                                    path='/chat'
                                    element={
                                        <RequireAuth>
                                            <SocketContextProvider>
                                                <Chat />
                                            </SocketContextProvider>
                                        </RequireAuth>
                                    }
                                />
                                <Route path='/about' element={<About />} />
                                <Route path='/logout' element={<Logout />} />
                                <Route path='*' element={<Navigate to='/chat' replace />} />
                            </Routes>
                        </BrowserRouter>
                    </CredentialContextProvider>
                </QueryClientProvider>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
