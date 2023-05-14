import { Typography } from '@mui/material'
import { useContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { RequireAuth } from './components/RequireAuth'
import { CredentialContext, CredentialContextProvider } from './contexts/Credentials'
import { Chat } from './pages/Chat'
import { Home } from './pages/Home'
import { Login } from './pages/Login'

const TempUsernameDisplay = () => {
    const { username, isLoggedIn } = useContext(CredentialContext)
    return (
        <Typography>
            {isLoggedIn === true ? <>you are logged in as: {username}</> : <>Not logged in</>}
        </Typography>
    )
}

function App() {
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
                </Routes>
            </BrowserRouter>
        </CredentialContextProvider>
    )
}

export default App
