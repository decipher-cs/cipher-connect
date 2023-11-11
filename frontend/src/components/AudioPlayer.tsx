import { PauseCircleFilledRounded, PlayCircleRounded } from '@mui/icons-material'
import { Box, IconButton, Paper, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

export const AudioPlayer = ({ audioSrc }: { audioSrc: string }) => {
    const waveformContainer = useRef(null)

    const theme = useTheme()

    const [isPlaying, setIsPlaying] = useState(false)

    const [wavesurfer, setWavesurfer] = useState<WaveSurfer>()

    const handlePlayPauseToggle = () => {
        if (wavesurfer !== undefined) wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
    }

    useEffect(() => {
        if (waveformContainer.current === null) return

        const ws = WaveSurfer.create({
            height: 23,
            waveColor: theme.palette.grey[500],
            progressColor: theme.palette.primary.main,
            url: audioSrc,
            container: waveformContainer.current,
            dragToSeek: true,
        })

        setWavesurfer(ws)
        setIsPlaying(false)

        const subscriptions = [ws.on('play', () => setIsPlaying(true)), ws.on('pause', () => setIsPlaying(false))]

        return () => {
            subscriptions.forEach(unsub => unsub())
            ws.destroy()
        }
    }, [waveformContainer.current, audioSrc])

    return (
        <Paper
            sx={{
                background: theme =>
                    theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.primary.contrastText,
                display: 'grid',
                gridAutoFlow: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1,
                pl: 1,
                borderRadius: '45px',
                aspectRatio: '12/3',
                width: '200px',
            }}
        >
            <IconButton onClick={handlePlayPauseToggle}>
                {isPlaying ? <PauseCircleFilledRounded color='primary' /> : <PlayCircleRounded color='primary' />}
            </IconButton>

            <Box ref={waveformContainer} sx={{ width: '100px' }} />
        </Paper>
    )
}
