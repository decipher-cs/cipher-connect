import { Typography } from '@mui/material'
import { useContext, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { RequireAuth } from './components/RequireAuth'
import { CredentialContext, CredentialContextProvider } from './contexts/Credentials'
import { Chat } from './pages/Chat'
import { Home } from './pages/Home'
import { Login } from './pages/Login'

const TempUsernameDisplay = () => {
    const { username, isLoggedIn } = useContext(CredentialContext)
    return <Typography>{isLoggedIn === true ? <>you are logged in as: {username}</> : <>Not logged in</>}</Typography>
}

function App() {
    const { isLoggedIn, setUserAccessToken, accessToken } = useContext(CredentialContext)

    useEffect(() => {
        // const accessToken = window.localStorage.getItem('accessTokenValue')

        // if (accessToken === null) return

        // setUserAccessToken(accessToken)
        console.log(isLoggedIn, accessToken)
    }, [])
    return (
        <CredentialContextProvider>
            <TempUsernameDisplay />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route
                        path='/chat'
                        element={
                            <RequireAuth>
                                <Chat />
                            </RequireAuth>
                        }
                    />
                    <Route path='/login' element={<Login />} />
                    <Route path='/*' element={<Navigate to='/' />} />
                </Routes>
            </BrowserRouter>
        </CredentialContextProvider>
    )
}

export default App
