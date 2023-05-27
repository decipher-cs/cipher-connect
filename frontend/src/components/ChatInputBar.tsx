import { ArrowRight } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Message, MessageList } from '../pages/Chat'
import { socket } from '../socket'

interface ChatInputBarProps {
    setChatMessageList: React.Dispatch<React.SetStateAction<MessageList>>
    recipient?: string
}

export const ChatInputBar = (props: ChatInputBarProps) => {
    const [currInputText, setCurrInputText] = useState('test value')

    const addMessgeToMessageList = () => {
        const trimmedText = currInputText.slice().trim()
        if (trimmedText.length <= 0) return
        const newObj: Message = {
            uuid: crypto.randomUUID(),
            sender: 'anon',
            time: new Date(),
            text: trimmedText,
        }
        props.setChatMessageList(prev => prev.concat(newObj))

        if (props.recipient !== undefined) {
            socket.emit('privateMessage', props.recipient, newObj)
        } else if (props.recipient === undefined) console.log('destination not defined')

        if (import.meta.env.PROD) setCurrInputText('') // Only clear the input onSubmit when running in production. In development, keep the input.
    }

    return (
        <div>
            <TextField
                sx={{ mt: 10 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton onClick={addMessgeToMessageList}>
                                <ArrowRight />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                value={currInputText}
                fullWidth
                placeholder='Enter text'
                onChange={e => setCurrInputText(e.target.value)}
                onKeyDown={e => (e.key === 'Enter' ? addMessgeToMessageList() : null)}
            />
        </div>
    )
}

export default ChatInputBar
