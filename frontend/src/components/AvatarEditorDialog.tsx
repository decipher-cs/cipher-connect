import AvatarEditor from 'react-avatar-editor'

import { useRef, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider, Stack, Typography } from '@mui/material'

export const AvatarEditorDialog = (props: {
    open: boolean
    imgSrc: File | string
    handleClose: () => void
    handleSubmit: (file: File | null) => void

    // avatarIdentifier: { roomId: string } | { username: string }
}) => {
    const [config, setConfig] = useState({
        image: props.imgSrc,
        rotate: 0,
        scale: 1,
        // position: Position,
        // preview: {
        //     img: string,
        //     rect: {
        //         x: number,
        //         y: number,
        //         width: number,
        //         height: number,
        //     },
        //     scale: number,
        //     width: number,
        //     height: number,
        //     borderRadius: number,
        // },
        width: 350,
        height: 350,
        disableCanvasRotation: true,
        // isTransparent: true,
        // showGrid: true, // doesn't work but why?
        // backgroundColor: ,
        border: 100,
        borderRadius: 999,
    })

    const ref = useRef<AvatarEditor>(null)

    return (
        <Dialog fullScreen open={props.open}>
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
                    <AvatarEditor {...config} ref={ref} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button
                    variant='contained'
                    onClick={async () => {
                        ref.current?.getImage().toBlob(blob => {
                            const file = blob && new File([blob], 'avatar', { type: blob.type })
                            props.handleSubmit(file)
                        })
                        props.handleClose()
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}
