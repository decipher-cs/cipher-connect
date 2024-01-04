import { AlertColor, AlertProps, Theme } from '@mui/material'
import { createContext, PropsWithChildren, useState } from 'react'
import { useDialog } from '../hooks/useDialog'
import { darkTheme, lightTheme } from '../theme/theme'

export type ToastContext = {
    dialogOpen: boolean
    handleOpen: () => void
    handleClose: () => void
    message: string
    setMessage: React.Dispatch<React.SetStateAction<string>>
    severity: AlertColor
    setSeverity: React.Dispatch<React.SetStateAction<AlertColor>>
}

export const ToastContext = createContext<null | ToastContext>(null)

export const ToastContextProvider = ({ children }: PropsWithChildren) => {
    const { handleOpen, handleClose, dialogOpen } = useDialog()
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState<AlertColor>('info')

    return (
        <ToastContext.Provider
            value={{ handleOpen, handleClose, dialogOpen, message, setMessage, severity, setSeverity }}
        >
            {children}{' '}
        </ToastContext.Provider>
    )
}
