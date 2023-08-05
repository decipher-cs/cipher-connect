import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
} from '@mui/material'
import React, { useState } from 'react'
import { Settings, SocketWithCustomEvents } from '../types/socket'

interface ProfileSettingsDialogProps {
    readonly dialogOpen: boolean
    readonly socketObject: SocketWithCustomEvents
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    userSettings: Settings
}
export const ProfileSettingsDialog = (props: ProfileSettingsDialogProps) => {
    const handleClose = () => props.setDialogOpen(false)

    const [uploadedImg, setUploadedImg] = useState<ArrayBuffer>()

    const [displayName, setDisplayName] = useState('')

    const handleImageUpload = (fileList: FileList | null) => {
        if (fileList === null || fileList.length === 0) return
        fileList[0].arrayBuffer().then(data => setUploadedImg(data))
    }

    const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDisplayName(e.target.value)

    return (
        <>
            <Dialog open={props.dialogOpen} onClose={handleClose}>
                <DialogTitle>Profile Settings</DialogTitle>

                <DialogContent>
                    <List disablePadding>
                        <ListItem>
                            <ListItemText>Change Display Image</ListItemText>
                            <Button component='label' variant='contained'>
                                Upload File
                                <input
                                    type='file'
                                    accept='image/*'
                                    hidden
                                    onChange={e => {
                                        handleImageUpload(e.target.files)
                                    }}
                                />
                            </Button>
                        </ListItem>
                        <ListItem>
                            <ListItemText>Change Display Name</ListItemText>
                            <TextField
                                size='small'
                                placeholder='Enter new name'
                                value={displayName}
                                onChange={handleDisplayNameChange}
                            />
                        </ListItem>
                    </List>

                    <DialogActions>
                        <Button
                            onClick={() => {
                                props.socketObject.emit('userSettingsUpdated', {
                                    userDisplayName:
                                        displayName === props.userSettings.userDisplayName || displayName.length <= 0
                                            ? null
                                            : displayName,
                                    userDisplayImage: uploadedImg === undefined ? null : uploadedImg,
                                })
                            }}
                        >
                            Update Settings
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    )
}
