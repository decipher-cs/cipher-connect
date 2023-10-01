import {
    Avatar,
    TextField,
    Box,
    Icon,
    Typography,
    IconButton,
    Button,
    Drawer,
    InputAdornment,
    Divider,
    Stack,
    Tooltip,
    Switch,
    ButtonGroup,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Collapse,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { SocketWithCustomEvents } from '../types/socket'
import { ForwardedRef, forwardRef, Ref, useRef, useState } from 'react'

export const ConfirmationDialog = ({
    openDialog,
    toggleConfirmationDialog,
    onAccept,
    onDecline,
}: {
    openDialog: boolean
    toggleConfirmationDialog: () => void
    onAccept: () => void
    onDecline?: () => void
}) => {
    return (
        <Dialog open={openDialog} fullWidth onClose={toggleConfirmationDialog}>
            <DialogTitle>Confirm Actions</DialogTitle>
            <DialogContent>Are you sure you want to proceed?</DialogContent>
            <DialogActions>
                <ButtonGroup fullWidth>
                    <Button
                        variant='contained'
                        onClick={() => {
                            if (onDecline) onDecline()
                            toggleConfirmationDialog()
                        }}
                    >
                        No, Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onAccept()
                            toggleConfirmationDialog()
                        }}
                    >
                        Yes, Continue
                    </Button>
                </ButtonGroup>
            </DialogActions>
        </Dialog>
    )
}
