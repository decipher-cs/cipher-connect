import React, { useEffect, useState } from 'react'

export const useAudioRecorder = (onRecordingFinish: (e: BlobEvent) => void) => {
    const [audioRecorder, setAudioRecorder] = useState<MediaRecorder>()

    const [recordingState, setRecordingState] = useState<RecordingState>('inactive')

    const [isMicReady, setIsMicReady] = useState<Boolean>(false)

    const [micPermission, setMicPermission] = useState<PermissionState>('prompt')

    const handleOnStart = (ev: Event) => {
        setRecordingState('recording')
    }

    const handleOnStop = (ev: Event) => {
        setRecordingState('inactive')
    }

    const handleAudioDataAvailable = (ev: BlobEvent) => {
        onRecordingFinish(ev)
    }

    const getMicPermission = async () => {
        try {
            if (window.MediaRecorder === undefined) throw Error('Audio recording facility not available on this device')

            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

            setMicPermission('granted')

            const audioRecorder = new MediaRecorder(mediaStream)

            audioRecorder.onstart = handleOnStart

            audioRecorder.onstop = handleOnStop

            audioRecorder.onerror = () => {
                console.log('error while recording audio')
            }

            audioRecorder.ondataavailable = handleAudioDataAvailable

            setAudioRecorder(audioRecorder)

            setIsMicReady(true)
        } catch (err) {
            setMicPermission('denied')
            setIsMicReady(false)
        }
    }

    useEffect(() => {
        getMicPermission()
    }, [])

    const startRecording = () => {
        audioRecorder?.start()
    }

    const stopRecording = () => audioRecorder?.stop()

    const pauseRecording = () => audioRecorder?.pause()

    const resumeRecording = () => audioRecorder?.resume()

    const getRecordingState = () => audioRecorder?.state

    const toggleAudioRecorderStartStop = () => {
        if (!audioRecorder) throw Error('Audio device is undefined', audioRecorder)

        if (audioRecorder.state === 'inactive') startRecording()
        else if (audioRecorder.state === 'recording') stopRecording()
    }

    return {
        toggleAudioRecorderStartStop,
        recordingState,
        isMicReady,
        micPermission,
    }
}
