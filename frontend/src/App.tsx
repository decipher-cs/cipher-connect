import { CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { useContext, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth'
import { CredentialContext, CredentialContextProvider } from './contexts/Credentials'
import { Chat } from './pages/Chat'
import { About } from './pages/About'
import { Login } from './pages/Login'
import { Logout } from './pages/Logout'
import { lightMod } from './theme/customThemes/lightModTheme'
import { Routes as ApiRoutes } from './types/routes'
import { SocketContextProvider } from './contexts/Socket'
import { socket } from './socket'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'

const TempUsernameDisplay = () => {
    const { username, handleCredentialChange, isLoggedIn } = useContext(CredentialContext)

    useEffect(() => {
        const username = window.localStorage.getItem('username')

        if (username === null) return

        const varifyUser = async () => {
            const URL = import.meta.env.VITE_SERVER_URL + ApiRoutes.varifyRefreshToken

            const response = await fetch(URL, {
                body: JSON.stringify({ username }),
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            if (response.statusText === 'OK') {
                const verifiedUsername: { username: string } = await response.json()
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
})

const App = () => {
    return (
        <ThemeProvider theme={lightMod}>
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
