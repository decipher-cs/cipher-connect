import { Avatar, Box, Button, ButtonGroup, SxProps } from '@mui/material'

interface SidebarProps {
    sx?: SxProps | undefined
}

const Sidebar = (props: SidebarProps) => {
    return (
        <Box sx={{ ...props.sx, display: 'grid' }}>
            <Avatar sx={{ justifySelf: 'center' }} />
            <ButtonGroup orientation='vertical'>
                <Button>Chat</Button>
                <Button>Profile Settings</Button>
                <Button>Logout</Button>
                <Button>Toggle Theme</Button>
            </ButtonGroup>
        </Box>
    )
}

export default Sidebar
