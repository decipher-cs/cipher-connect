import { Button, ButtonProps, CircularProgress } from '@mui/material'
import React from 'react'

export const ButtonWithLoader = ({
    showLoader,
    children,
    ...buttonProps
}: {
    showLoader: boolean
    children?: React.PropsWithChildren['children']
} & ButtonProps) => {
    return (
        <Button {...buttonProps}>
            {children}
            {showLoader ? <CircularProgress sx={{ position: 'absolute' }} size={28} /> : null}
        </Button>
    )
}
