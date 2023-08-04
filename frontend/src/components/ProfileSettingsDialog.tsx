import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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

    const [displayName, setDisplayName] = useState(props.userSettings.userDisplayName)

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
                    <DialogContentText>Change Display Image</DialogContentText>
                    <Button variant='contained' component='label'>
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
                    <DialogContentText>Change Display Name</DialogContentText>
                    <TextField
                        helperText='Change Display Name'
                        placeholder='new name'
                        value={displayName}
                        onChange={handleDisplayNameChange}
                    />

                    <DialogActions>
                        <Button
                            onClick={() => {
                                props.socketObject.emit('userSettingsUpdated', {
                                    userDisplayName:
                                        displayName === props.userSettings.userDisplayName ? null : displayName,
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
