import { Backdrop, Container, Dialog, DialogContent } from '@mui/material'
import { PropsWithChildren } from 'react'
export type MediaPreviewProps = {
    handleClose: () => void
    open: boolean
} & PropsWithChildren
export const MediaPreview = ({ children, handleClose, open }: MediaPreviewProps) => {
    return (
        <Backdrop
            open={open}
            onClick={handleClose}
            sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1, border: 'solid red 8px' }}
        >
            {children}
        </Backdrop>
    )
}
