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

const TempUsernameDisplay = () => {
    const { username, handleCredentialChange, isLoggedIn } = useContext(CredentialContext)

    useEffect(() => {
        const username = window.localStorage.getItem('username')

        if (username === null) return

        const varifyUser = async () => {
            const URL = import.meta.env.PROD
                ? import.meta.env.VITE_SERVER_PROD_URL
                : import.meta.env.VITE_SERVER_DEV_URL

            const response = await fetch(`${URL}/varifyRefreshToken`, {
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

const App = () => {
    return (
        <ThemeProvider theme={lightMod}>
            <CssBaseline>
                <CredentialContextProvider>
                    <BrowserRouter>
                        <TempUsernameDisplay />

                        <Routes>
                            <Route path='/login' element={<Login />} />
                            <Route
                                path='/chat'
                                element={
                                    <RequireAuth>
                                        <Chat />
                                    </RequireAuth>
                                }
                            />
                            <Route path='/about' element={<About />} />
                            <Route path='/logout' element={<Logout />} />
                            <Route path='*' element={<Navigate to='/chat' replace />} />
                        </Routes>
                    </BrowserRouter>
                </CredentialContextProvider>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
