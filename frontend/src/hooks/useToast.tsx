import { AlertProps, Snackbar, SnackbarProps } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { ToastContext } from '../contexts/ToastContextProvider'
import { useDialog } from './useDialog'

// Also called a snackbar. Docs -> https://mui.com/material-ui/react-snackbar/

export const useToast = () => {
    const toast = useContext(ToastContext)

    if (!toast) throw new Error('useToast hook must be used inside the context provider.')

    const { handleOpen, handleClose, dialogOpen, message, setMessage, severity, setSeverity } = toast

    const notify = (message: string, severity?: AlertProps['severity']) => {
        severity = severity ?? 'info'
        setSeverity(severity)
        setMessage(message)
        handleOpen()
    }

    const snackbarControllProps = {
        onClose: handleClose,
        open: dialogOpen,
    } satisfies SnackbarProps

    const alertControllProps = { severity, onClose: handleClose } satisfies AlertProps

    return { ...toast, alertControllProps, snackbarControllProps, notify, message }
}
