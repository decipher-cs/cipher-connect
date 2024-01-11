import { Button, ButtonGroup, ButtonProps, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { PropsWithChildren } from 'react'
import { useDialog } from '../hooks/useDialog'

export const ButtonWithConfirmationDialog = (
    props: { onConfirm: () => void; onDecline?: () => void } & ButtonProps & PropsWithChildren
) => {
    const { onConfirm, onDecline, children, ...ButtonProps } = props
    const { dialogOpen, handleOpen, handleClose } = useDialog()
    return (
        <>
            <Button {...ButtonProps} onClick={handleOpen}>
                {children}
            </Button>
            <Dialog open={dialogOpen} fullWidth onClose={handleClose}>
                <DialogTitle>Confirm Actions</DialogTitle>
                <DialogContent>Are you sure you want to proceed?</DialogContent>
                <DialogActions>
                    <ButtonGroup fullWidth>
                        <Button
                            variant='contained'
                            onClick={() => {
                                if (onDecline) onDecline()
                                handleClose()
                            }}
                        >
                            No, Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                onConfirm()
                                handleClose()
                            }}
                        >
                            Yes, Continue
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    )
}
