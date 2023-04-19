import { AccountCircle, ArrowRight, Circle, CircleSharp } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { Message, MessageList } from '../App'

interface ChatInputBarProps {
    setChatMessageList: React.Dispatch<React.SetStateAction<MessageList>>
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
        // setCurrInputText('') //uncomment after testing. TODO
    }

    const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            addMessgeToMessageList()
        }
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
                onKeyDown={handleEnterKeyDown}
            />
        </div>
    )
}

export default ChatInputBar
