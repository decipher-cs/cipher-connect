import { useState } from 'react'

export const useDialog = (openByDefault = false) => {
    const [dialogOpen, setDialogOpen] = useState(openByDefault)

    const handleClose = () => setDialogOpen(false)
    const handleOpen = () => setDialogOpen(true)
    const handleToggle = () => setDialogOpen(p => !p)

    return { dialogOpen, handleOpen, handleClose, handleToggle, setDialogOpen }
}
