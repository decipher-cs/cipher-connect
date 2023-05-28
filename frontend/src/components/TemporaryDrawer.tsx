import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import React, { useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'

export default function TemporaryDrawer(
    props: React.PropsWithChildren<{ network: string[]; handleRoomOnClick: (key: string) => void }>
) {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false)

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }

        setDrawerIsOpen(open)
    }

    const list = () => (
        <Box sx={{ width: 'auto' }} role='presentation' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
                {props.network.map((text, index) => (
                    <ListItem key={text} disablePadding onClick={() => props.handleRoomOnClick(text)}>
                        <ListItemButton>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    return (
        <>
            <Tooltip title='Change Room' placement='top'>
                <IconButton onClick={toggleDrawer(true)}>
                    <MenuRoundedIcon />
                </IconButton>
            </Tooltip>
            <Drawer anchor='bottom' open={drawerIsOpen} onClose={toggleDrawer(false)}>
                {props.children}
                {list()}
            </Drawer>
        </>
    )
}
