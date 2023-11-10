import { PauseCircleFilledRounded, PlayCircleRounded } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

export const AudioPlayer = ({ audioSrc }: { audioSrc: string }) => {
    const waveformContainer = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false)

    const [wavesurfer, setWavesurfer] = useState<WaveSurfer>()

    const handlePlayPauseToggle = () => {
        if (wavesurfer !== undefined) wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
    }

    useEffect(() => {
        if (waveformContainer.current === null) return

        const ws = WaveSurfer.create({
            height: 20,
            waveColor: 'blue',
            progressColor: 'white',
            url: audioSrc,
            container: waveformContainer.current,
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
        <Box sx={{ border: 'solid 2px red', display: 'flex' }}>
            <Box sx={{ flexShrink: 0, flexGrow: 1 , flexBasis: '100%'}} ref={waveformContainer} style={{ minHeight: '120px' }} />

            <IconButton onClick={handlePlayPauseToggle}>
                {isPlaying ? <PlayCircleRounded /> : <PauseCircleFilledRounded />}
            </IconButton>
        </Box>
    )
}
