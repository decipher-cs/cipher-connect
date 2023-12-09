import React, { useEffect, useRef, useState } from 'react'

export const useAudioRecorder = (onRecordingFinishCallback: (e: BlobEvent) => void) => {
    const onRecordingFinish = useRef((e: BlobEvent) => {})

    onRecordingFinish.current = onRecordingFinishCallback

    const handleAudioDataAvailable = (ev: BlobEvent) => {
        onRecordingFinish.current(ev)
    }

    const audioRecorder = useRef<MediaRecorder>()

    const [recordingState, setRecordingState] = useState<RecordingState>('inactive')

    const [isMicReady, setIsMicReady] = useState<Boolean>(false)

    const [micPermission, setMicPermission] = useState<PermissionState>('prompt')

    const handleOnPause = (ev: Event) => {
        setRecordingState('paused')
    }

    const handleOnStart = (ev: Event) => {
        setRecordingState('recording')
    }

    const handleOnStop = (ev: Event) => {
        setRecordingState('inactive')
    }

    const getMicPermission = async () => {
        try {
            if (window.MediaRecorder === undefined) throw Error('Audio recording facility not available on this device')

            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

            setMicPermission('granted')

            audioRecorder.current = new MediaRecorder(mediaStream)

            audioRecorder.current.onstart = handleOnStart

            audioRecorder.current.onstop = handleOnStop

            audioRecorder.current.onpause = handleOnPause

            audioRecorder.current.onresume = handleOnStart

            audioRecorder.current.onerror = () => {
                console.log('error while recording audio')
            }

            audioRecorder.current.ondataavailable = handleAudioDataAvailable

            setIsMicReady(true)
        } catch (err) {
            setMicPermission('denied')
            setIsMicReady(false)
        }
    }

    useEffect(() => {
        getMicPermission()

        return () => {
            stopRecording()
            setRecordingState('inactive')
        }
    }, [])

    const startRecording = () => audioRecorder.current?.start()

    const stopRecording = () => audioRecorder.current?.stop()

    const pauseRecording = () => audioRecorder.current?.pause()

    const resumeRecording = () => audioRecorder.current?.resume()

    const getRecordingState = () => audioRecorder.current?.state

    const toggleAudioRecorderStartStop = () => {
        if (!audioRecorder.current) throw Error('Audio device is undefined')

        if (audioRecorder.current.state === 'inactive') startRecording()
        else if (audioRecorder.current.state === 'recording') stopRecording()
    }

    return {
        toggleAudioRecorderStartStop,
        recordingState,
        isMicReady,
        micPermission,
    }
}
