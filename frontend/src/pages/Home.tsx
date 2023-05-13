import {  Paper, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CredentialContext } from '../contexts/Credentials'

export const Home = () => {
    const { isLoggedIn, username } = useContext(CredentialContext)
    return (
        <>
            <Container maxWidth='sm' sx={{ display: 'grid', placeItems: 'center' }}>
                <Typography variant='h1'>Home 👋</Typography>
                {isLoggedIn ? <>You are logged in as {username}</> : <>Please Login in to continue to chat</>}

                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Paper sx={{ p: 2 }}>
                        <Link to={'/chat'}>Chat</Link>
                    </Paper>
                </Box>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Paper sx={{ p: 2 }}>
                        <Link to={'/login'}>Login</Link>
                    </Paper>
                </Box>
            </Container>
        </>
    )
}
