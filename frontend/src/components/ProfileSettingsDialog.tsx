import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

interface ProfileSettingsDialogProps {
    readonly dialogOpen: boolean
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const ProfileSettingsDialog = (props: ProfileSettingsDialogProps) => {
    const handleClose = () => props.setDialogOpen(false)

    return (
        <>
            <Dialog open={props.dialogOpen} onClose={handleClose}>
                <DialogTitle>Profile Settings</DialogTitle>
                <DialogContent>Hellow world</DialogContent>
            </Dialog>
        </>
    )
}
