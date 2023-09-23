import { AudiotrackRounded, FilePresentRounded, ImageRounded, VideoCameraBackRounded } from '@mui/icons-material'
import { Button, Input, InputBase, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@mui/material'
import React, { useState } from 'react'
import { MessageContentType } from '../types/prisma.client'
import { supportedExtensions } from '../types/supportedExtensions'

export const MultimediaAttachmentMenu = (props: {
    anchorEl: HTMLElement | null
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>
    handleUpload: (fileList: FileList | null, type: Exclude<MessageContentType, MessageContentType.text>) => void
}) => {
    const open = Boolean(props.anchorEl)

    return (
        <Menu
            open={open}
            onClose={() => props.setAnchorEl(null)}
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
            <MenuList>
                <MenuItem component='label'>
                    <input
                        multiple
                        type='file'
                        accept={supportedExtensions.audio.join(', ')}
                        hidden
                        onChange={e => props.handleUpload(e.target.files, MessageContentType.audio)}
                    />
                    <ListItemIcon>
                        <AudiotrackRounded />
                    </ListItemIcon>
                    <ListItemText>Audio</ListItemText>
                </MenuItem>

                <MenuItem component='label'>
                    <input
                        multiple
                        type='file'
                        accept={supportedExtensions.image.join(', ')}
                        hidden
                        onChange={e => props.handleUpload(e.target.files, MessageContentType.image)}
                    />
                    <ListItemIcon>
                        <ImageRounded />
                    </ListItemIcon>
                    <ListItemText>Image</ListItemText>
                </MenuItem>

                <MenuItem component='label'>
                    <input
                        multiple
                        type='file'
                        accept={supportedExtensions.video.join(', ')}
                        hidden
                        onChange={e => props.handleUpload(e.target.files, MessageContentType.video)}
                    />
                    <ListItemIcon>
                        <VideoCameraBackRounded />
                    </ListItemIcon>
                    <ListItemText>Video</ListItemText>
                </MenuItem>

                <MenuItem component='label'>
                    <input
                        multiple
                        type='file'
                        accept={supportedExtensions.file.join(', ')}
                        hidden
                        onChange={e => props.handleUpload(e.target.files, MessageContentType.file)}
                    />
                    <ListItemIcon>
                        <FilePresentRounded />
                    </ListItemIcon>
                    <ListItemText>File</ListItemText>
                </MenuItem>
            </MenuList>
        </Menu>
    )
}
