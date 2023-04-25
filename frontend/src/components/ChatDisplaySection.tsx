import { Button, Paper, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { memo, useEffect, useRef } from 'react'
import { MessageList } from '../pages/Chat'

export interface ChatDisplaySectionProps {
    chatMessageList: MessageList
    fakeScrollDiv: React.MutableRefObject<HTMLDivElement | null>
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
    const subaru = useRef<HTMLDivElement>(null)

    return (
        <>
            <Button onClick={()=>{
                subaru.current?.scroll(99990, 9990)
            }}>scroll up</Button>
            <Button>scroll down</Button>
            <Container
                ref={props.fakeScrollDiv}
                sx={{
                    maxWidth: '90vw',
                    maxHeight: '40vh',
                    overflow: 'scroll',
                    p: 2,
                    backgroundColor: 'grey',
                    gap: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {props.chatMessageList.map(message => (
                    <SingleTextMessage key={message.uuid} message={message} />
                ))}
                <span ref={props.fakeScrollDiv}>hello</span>
            </Container>
        </>
    )
}

export default ChatDisplaySection
