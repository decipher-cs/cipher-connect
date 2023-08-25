import { FilePresentRounded, ImageRounded, VideoCameraBackRounded } from '@mui/icons-material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import React from 'react'

export const MultimediaAttachmentMenu = (props: {
    anchorEl: HTMLElement | null
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>
}) => {
    const open = Boolean(props.anchorEl)

    const handleClose = () => {
        props.setAnchorEl(null)
    }
    return (
        <Menu
            open={open}
            onClose={handleClose}
            anchorEl={props.anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            variant='menu'
        >
            <MenuItem onClick={handleClose}>
                <IconButton>
                    <VideoCameraBackRounded />
                </IconButton>
            </MenuItem>
            <MenuItem onClick={handleClose}>
                <IconButton>
                    <ImageRounded />
                </IconButton>
            </MenuItem>
            <MenuItem onClick={handleClose}>
                <IconButton>
                    <FilePresentRounded />
                </IconButton>
            </MenuItem>
        </Menu>
    )
}
