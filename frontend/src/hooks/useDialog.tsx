import { useState } from 'react'

export const useDialog = () => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleClose = () => setDialogOpen(false)
    const handleOpen = () => setDialogOpen(true)
    const handleToggle = () => setDialogOpen(p => !p)

    return { dialogOpen, handleOpen, handleClose, handleToggle, setDialogOpen }
}
