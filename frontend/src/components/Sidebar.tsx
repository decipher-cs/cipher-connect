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
import { room as Room } from '../types/prisma.client'

// interface SidebarListProps extends Pick<SidebarProps, 'listItems'> {}

interface SidebarProps extends React.PropsWithChildren {
    listItems: Room[]

    handleClickOnList: (key: string) => void
    handleClickOnListDeleteIcon: (clickedItem: string) => void
}

const Sidebar = (props: SidebarProps) => {
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

    const SidebarList = () => {
        return (
            <Box sx={{ width: 'auto' }} role='presentation'>
                <List>
                    {props.listItems.map(({ roomId, roomDisplayName, isMaxCapacityTwo }, i) => (
                        <ListItem key={i} disablePadding onClick={() => props.handleClickOnList(roomId)}>
                            <ListItemButton>
                                <ListItemIcon onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                                    <AccountCircleSharp />
                                </ListItemIcon>
                                <ListItemText
                                    primary={roomDisplayName}
                                    onClick={toggleDrawer(false)}
                                    onKeyDown={toggleDrawer(false)}
                                />
                            </ListItemButton>
                            <IconButton
                                onClick={() => {
                                    props.handleClickOnListDeleteIcon(roomId)
                                    toggleDrawer(false)
                                }}
                            >
                                <DeleteSharp />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        )
    }
    return (
        <>
            <Tooltip title='Change Room' placement='top'>
                <IconButton onClick={toggleDrawer(true)}>
                    <MenuRoundedIcon />
                </IconButton>
            </Tooltip>
            <Drawer anchor='bottom' open={drawerIsOpen} onClose={toggleDrawer(false)}>
                <SidebarList />
            </Drawer>
        </>
    )
}

export default Sidebar
