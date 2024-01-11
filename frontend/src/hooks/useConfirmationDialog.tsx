import React from 'react'
import { useDialog } from './useDialog'

export const useConfirmationDialog = () => {
    const dialogProps = useDialog()
    const onConfirm = (action: () => void) => {
        action()
        dialogProps.handleClose()
    }
    const onDecline = (action?: () => void) => {
        if (action) action()
        dialogProps.handleClose()
    }
    return { ...dialogProps, onConfirm, onDecline }
}
