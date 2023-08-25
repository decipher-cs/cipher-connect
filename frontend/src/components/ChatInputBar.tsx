import { ArrowRight, AttachFileRounded, MicRounded } from '@mui/icons-material'
import { IconButton, InputAdornment, ToggleButton } from '@mui/material'
import { useState } from 'react'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { Message } from '../pages/Chat'
import { RoomWithParticipants } from '../types/socket'
import { MultimediaAttachmentMenu } from './MultimediaAttachmentMenu'
import { StyledTextField } from './StyledTextField'

interface ChatInputBarProps {
    setChatMessageList: React.Dispatch<React.SetStateAction<Message[]>>
    currRoom: RoomWithParticipants
}

export const ChatInputBar = (props: ChatInputBarProps) => {
    const [currInputText, setCurrInputText] = useState('')

    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

    const audioRecorder = useAudioRecorder()

    const addMessgeToMessageList = () => {
        const trimmedText = currInputText.slice().trim()
        if (trimmedText.length <= 0) return

        if (props.currRoom !== undefined) {
            // socket.emit('privateMessage', props.currRoom.roomId, trimmedText)
        } else console.log('No room selected. This should not be possible.')

        setCurrInputText('')
    }

    const sendMessageContents = () => {}
    const sendAudioMessage = () => {}
    const detectFileType = () => {
        console.log('file is of type:')
    }

    return (
        <>
            {audioRecorder.recordedAudioFile !== undefined ? (
                <>
                    <audio src={URL.createObjectURL(audioRecorder.recordedAudioFile)} controls>
                        audio
                    </audio>
                </>
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
                            <IconButton
                                onClick={e => {
                                    addMessgeToMessageList()
                                    setMenuAnchor(e.currentTarget)
                                }}
                            >
                                {/* /TODO: add ability to attach files like images and pdf/ */}
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
                            <IconButton onClick={addMessgeToMessageList}>
                                <ArrowRight />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                value={currInputText}
                fullWidth
                placeholder='Type A Message...'
                onChange={e => setCurrInputText(e.target.value)}
                onKeyDown={e => (e.key === 'Enter' ? addMessgeToMessageList() : null)}
            />
            <MultimediaAttachmentMenu anchorEl={menuAnchor} setAnchorEl={setMenuAnchor} />
        </>
    )
}
