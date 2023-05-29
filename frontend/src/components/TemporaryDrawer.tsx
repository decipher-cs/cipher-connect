import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React, { useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { AccountCircleSharp, DeleteSharp } from '@mui/icons-material'

export default function TemporaryDrawer(
    props: React.PropsWithChildren<{
        network: string[]
        handleClickOnList: (key: string) => void
        handleClickOnListIcon: (clickedUsername: string) => void
    }>
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
        <Box sx={{ width: 'auto' }} role='presentation'>
            <List>
                {props.network.map(text => (
                    <ListItem key={text} disablePadding onClick={() => props.handleClickOnList(text)}>
                        <ListItemButton>
                            <ListItemIcon onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                                <AccountCircleSharp />
                            </ListItemIcon>
                            <ListItemText
                                primary={text}
                                onClick={toggleDrawer(false)}
                                onKeyDown={toggleDrawer(false)}
                            />
                            <IconButton onClick={() => props.handleClickOnListIcon(text)}>
                                <DeleteSharp />
                            </IconButton>
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
