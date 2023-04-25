import { Button, Paper, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { Link } from 'react-router-dom'

export const Home = () => {
    return (
        <>
            <Container maxWidth='sm' sx={{ display: 'grid', placeItems: 'center' }}>
                <Typography variant='h1'>Home 👋</Typography>

                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Paper sx={{ p: 2 }}>
                        <Link to={'/chat'}>Chat</Link>
                    </Paper>
                </Box>
            </Container>
        </>
    )
}
