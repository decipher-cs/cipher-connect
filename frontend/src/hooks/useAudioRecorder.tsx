import React, { useEffect, useState } from 'react'

export const useAudioRecorder = () => {
    const [audioStream, setAudioStream] = useState<MediaStream>()
    const [recorder, setRecorder] = useState<MediaRecorder>()
    const [microphoneReady, setMicrophoneReady] = useState<Boolean>(false)
    const [recordingState, setRecordingState] = useState<RecordingState>()

    const handleOnStart = (ev: Event) => {
        setRecordingState('recording')
    }

    const handleOnStop = (ev: Event) => {
        setRecordingState('inactive')
    }

    const setupMicrophoe = async () => {
        if (window.MediaRecorder === undefined) {
            alert('Audio recording is not supported on this device.')
            return
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            setAudioStream(stream)
            const audioRecorder = new MediaRecorder(stream)
            setRecorder(audioRecorder)
            audioRecorder.onstart = handleOnStart
            audioRecorder.onstop = handleOnStop
            setMicrophoneReady(true)
        } catch (error) {
            setMicrophoneReady(false)
        }
    }

    useEffect(() => {
        setupMicrophoe()
    }, [])

    const startRecording = () => recorder?.start()

    const stopRecording = () => recorder?.stop()

    const pauseRecording = () => recorder?.pause()

    const resumeRecording = () => recorder?.resume()

    const getRecordingState = () => recorder?.state

    const toggleRecorderStartStop = () => {
        if (recorder?.state === 'inactive') startRecording()
        else if (recorder?.state === 'recording') stopRecording()
    }

    return {
        toggleRecorderStartStop,
        recordingState,
        recorder,
    }
}
