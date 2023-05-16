import { AppBar, Box, Button, Toolbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const Navbar = (props: {}) => {
    const navigate = useNavigate()
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <Button color='inherit' onClick={()=>{navigate('/')}}>home</Button>
                    <Button color='inherit' onClick={()=>{navigate('/login')}}>login</Button>
                    <Button color='inherit' onClick={()=>{navigate('/chat')}}>chat</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
