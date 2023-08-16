import React, { useEffect, useState } from 'react'

export const useAudioRecorder = () => {
    const [audioStream, setAudioStream] = useState<MediaStream>()
    const [audioRecorder, setAudioRecorder] = useState<MediaRecorder>()
    const [recordedAudioFile, setRecordedAudioFile] = useState<Blob>()

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then(audioStream => {
                const audioRecorder = new MediaRecorder(audioStream)
                setAudioStream(audioStream)
                setAudioRecorder(audioRecorder)
                audioRecorder.ondataavailable = ev => {
                    setRecordedAudioFile(ev.data)
                    console.log('ev is', ev.data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const startRecording = () => audioRecorder?.start()
    const stopRecording = () => audioRecorder?.stop()
    const pauseRecording = () => audioRecorder?.pause()
    const resumeRecording = () => audioRecorder?.resume()
    // const getRecordingData = () => audioRecorder?.requestData()
    const getRecordingState = () => audioRecorder?.state

    return {
        audioRecorder,
        audioStream,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        getRecordingState,
        recordedAudioFile,
        // getRecordingData,
    }
}
