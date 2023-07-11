import { Avatar, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'

export const MessageSidebar = (props: {}) => {
    return (
        <Box
            sx={{
                border: 'solid red 3px',
                maxWidth: '30%',
            }}
        >
            <List>
                <ListItem>
                    <ListItemIcon>
                        <Avatar />
                    </ListItemIcon>
                    <ListItemText primary={<>name</>} secondary={<>subtext</>} />
                </ListItem>
            </List>
        </Box>
    )
}


