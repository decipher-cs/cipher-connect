import { Ref, useRef, useState } from 'react'
import AvatarEditor, { AvatarEditorProps } from 'react-avatar-editor'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider, Stack, Typography } from '@mui/material'

interface ImageEditroDialogProps {
    dialogOpen: boolean
    originalImgSource: string | File
    handleClose: () => void
    editorRef: React.MutableRefObject<null | AvatarEditor>
    onSuccess: (canvasElement: HTMLCanvasElement | undefined) => void
}

export const ImageEditorDialog = ({
    handleClose,
    dialogOpen,
    originalImgSource,
    editorRef,
    onSuccess,
}: ImageEditroDialogProps) => {
    const [config, setConfig] = useState<Partial<AvatarEditorProps> & { image: string | File }>({
        image: originalImgSource,
        rotate: 0,
        scale: 1,
        width: 350,
        height: 350,
        disableCanvasRotation: true,
        border: 100,
        borderRadius: 999,
    })

    return (
        <Dialog fullScreen open={dialogOpen}>
            <DialogTitle>Edit Avatar</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2} direction='row' sx={{ mb: 1 }} alignItems='center'>
                    <Stack spacing={2} direction='column' sx={{ m: 1, flexGrow: 1 }}>
                        <Typography>Zoom</Typography>
                        <Slider
                            onChange={(_, scale) => Array.isArray(scale) || setConfig(p => ({ ...p, scale }))}
                            min={0}
                            max={3.0}
                            value={config.scale}
                            step={0.1}
                            valueLabelDisplay='auto'
                            marks={[
                                { value: 0, label: 0 },
                                { value: 1, label: 1 },
                                { value: 2, label: 2 },
                                { value: 3, label: 3 },
                            ]}
                        />
                        <Typography>Rotate</Typography>
                        <Slider
                            onChange={(_, rotate) => Array.isArray(rotate) || setConfig(p => ({ ...p, rotate }))}
                            min={-360}
                            max={360}
                            value={config.rotate}
                            step={10}
                            valueLabelDisplay='auto'
                            marks={[
                                { value: -360, label: -360 },
                                { value: 0, label: 0 },
                                { value: 360, label: 360 },
                            ]}
                        />
                    </Stack>
                    <AvatarEditor {...config} ref={editorRef} />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        onSuccess(editorRef.current?.getImage())
                        handleClose()
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}
