import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React, { useState } from 'react'
import { Collapse, IconButton, Tooltip } from '@mui/material'
import { AccountCircleSharp, DeleteSharp } from '@mui/icons-material'
import { room as Room } from '../types/prisma.client'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

interface SidebarProps extends React.PropsWithChildren {
    listItems: Room[]

    handleClickOnList: (key: string) => void
    handleClickOnListDeleteIcon: (clickedItem: string) => void
    handleClickOnItemHideIcon: (clickedItem: string) => void
}

const Sidebar = (props: SidebarProps) => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false)

    const [open, setOpen] = useState(true)

    const handleClick = () => {
        setOpen(!open)
    }

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
                        <ListItem key={i} disablePadding onClick={toggleDrawer(false)}>
                            <ListItemButton>
                                <ListItemIcon
                                    onClick={() => {
                                        props.handleClickOnList(roomId)
                                    }}
                                    onKeyDown={toggleDrawer(false)}
                                >
                                    <AccountCircleSharp />
                                </ListItemIcon>
                                <ListItemText
                                    primary={roomDisplayName}
                                    onClick={() => {
                                        props.handleClickOnList(roomId)
                                    }}
                                    onKeyDown={toggleDrawer(false)}
                                />
                            </ListItemButton>
                            <IconButton
                                onClick={() => {
                                    props.handleClickOnItemHideIcon(roomId)
                                }}
                                onKeyDown={toggleDrawer(false)}
                            >
                                <VisibilityOff />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    // props.handleClickOnListDeleteIcon(roomId)
                                    console.log('Functionality Temporarily Disabled')
                                }}
                                onKeyDown={toggleDrawer(false)}
                            >
                                <DeleteSharp />
                            </IconButton>
                        </ListItem>
                        // collapsable list here with all hidden users.
                        //
                    ))}
                </List>
                <List>
                    <IconButton
                        onClick={() => {
                            handleClick()
                        }}
                    >
                        <VisibilityOff />
                    </IconButton>
                    <Collapse in={open} timeout='auto' unmountOnExit>
                        <ListItem>sample_Item</ListItem>
                        <ListItem>sample_Item</ListItem>
                        <ListItem>sample_Item</ListItem>
                    </Collapse>
                </List>
            </Box>
        )
    }
    return (
        <>
            <Tooltip title='Change Room' placement='left'>
                <IconButton onClick={toggleDrawer(true)}>
                    <MenuRoundedIcon />
                </IconButton>
            </Tooltip>
            <Drawer anchor='left' open={drawerIsOpen} onClose={toggleDrawer(false)}>
                <SidebarList />
            </Drawer>
        </>
    )
}

export default Sidebar
