import { Paper, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { memo } from 'react'
import { MessageList } from '../App'

export interface ChatDisplaySectionProps {
    chatMessageList: MessageList
}

const SingleTextMessage = memo((props: { message: MessageList[number] }) => {
    return (
        <>
            <Paper sx={{ width: 'fit-content', p: 1.5, placeSelf: 'flex-end' }}>
                <Typography key={props.message.uuid}>{props.message.text}</Typography>
            </Paper>
        </>
    )
})

const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    return (
        <>
            <Container
                sx={{ width: '90vw', height: 'fit-content', p: 2, backgroundColor: 'grey', gap: 2, display: 'grid' }}
            >
                {props.chatMessageList.map(message => (
                    <SingleTextMessage key={message.uuid} message={message} />
                ))}
            </Container>
        </>
    )
}

export default ChatDisplaySection
