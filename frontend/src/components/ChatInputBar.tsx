import { ArrowRight, AttachFileRounded, MicRounded } from '@mui/icons-material'
import { IconButton, InputAdornment, ToggleButton } from '@mui/material'
import { useState } from 'react'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { Message } from '../pages/Chat'
import { MessageContentType } from '../types/prisma.client'
import { RoomWithParticipants, SocketWithCustomEvents } from '../types/socket'
import { MultimediaAttachmentMenu } from './MultimediaAttachmentMenu'
import { StyledTextField } from './StyledTextField'

interface ChatInputBarProps {
    setChatMessageList: React.Dispatch<React.SetStateAction<Message[]>>
    currRoom: RoomWithParticipants
    socketObject: SocketWithCustomEvents
}

export const ChatInputBar = (props: ChatInputBarProps) => {
    const [currInputText, setCurrInputText] = useState('')

    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

    const [recordedAudioFile, setRecordedAudioFile] = useState<Blob>()

    const audioRecorder = useAudioRecorder()

    const handleUpload = (fileList: FileList | null, type: MessageContentType) => {
        if (fileList === null || fileList.length <= 0) return
        setMenuAnchor(null) // closes the open menu
        for (const file of fileList) {
            // TODO: preview file before uploading to server.
            props.socketObject.emit('message', props.currRoom.roomId, file, type)
        }
    }

    const emitTextMessage = () => {
        const trimmedText = currInputText.slice().trim()
        if (trimmedText.length <= 0) return
        props.socketObject.emit('message', props.currRoom.roomId, trimmedText, 'text')
        setCurrInputText('')
    }

    if (audioRecorder.recorder !== undefined) {
        audioRecorder.recorder.ondataavailable = ev => {
            setRecordedAudioFile(ev.data)
            props.socketObject.emit('message', props.currRoom.roomId, ev.data, 'audio')
        }
    }

    return (
        <>
            {recordedAudioFile !== undefined ? (
                <audio src={URL.createObjectURL(recordedAudioFile)} controls>
                    audio
                </audio>
            ) : null}
            <StyledTextField
                sx={{
                    backgroundColor: 'white',
                    width: '80%',
                    justifySelf: 'center',
                    mb: 1,
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <IconButton onClick={e => setMenuAnchor(e.currentTarget)}>
                                <AttachFileRounded />
                            </IconButton>
                        </InputAdornment>
                    ),

                    endAdornment: (
                        <InputAdornment position='end'>
                            <ToggleButton
                                onClick={audioRecorder.toggleRecorderStartStop}
                                selected={audioRecorder.recordingState === 'recording'}
                                value='audio recording'
                                color='primary'
                                sx={{ border: '0px' }}
                            >
                                <MicRounded />
                            </ToggleButton>
                            <IconButton onClick={emitTextMessage}>
                                <ArrowRight />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                value={currInputText}
                fullWidth
                placeholder='Type A Message...'
                onChange={e => setCurrInputText(e.target.value)}
                onKeyDown={e => (e.key === 'Enter' ? emitTextMessage() : null)}
            />

            <MultimediaAttachmentMenu anchorEl={menuAnchor} setAnchorEl={setMenuAnchor} handleUpload={handleUpload} />
        </>
    )
}
