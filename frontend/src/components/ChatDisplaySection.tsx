import { Button, Paper, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { memo, useEffect, useRef } from 'react'
import { MessageList } from '../pages/Chat'

export interface ChatDisplaySectionProps {
    chatMessageList: MessageList
    fakeScrollDiv: React.MutableRefObject<HTMLDivElement | null>
}

const SingleTextMessage = memo((props: { message: MessageList[number]; endRef?: React.RefObject<HTMLDivElement> }) => {
    return (
        <>
            <Paper sx={{ width: 'fit-content', p: 1.5, placeSelf: 'flex-end' }}>
                {props.endRef === undefined ? (
                    <Typography key={props.message.uuid}>{props.message.text}</Typography>
                ) : (
                    <div ref={props.endRef}>
                        <Typography key={props.message.uuid}>{props.message.text}</Typography>
                    </div>
                )}
            </Paper>
        </>
    )
})

const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    const scrollToBottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollToBottomRef.current === null) return
        scrollToBottomRef.current.scrollIntoView(true)
        console.log(props.chatMessageList.at(-1))
    }, [props.chatMessageList])

    return (
        <>
            <Container
                ref={props.fakeScrollDiv}
                sx={{
                    maxWidth: '90vw',
                    height: '50vh',
                    overflow: 'scroll',
                    p: 2,
                    backgroundColor: 'grey',
                    gap: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {props.chatMessageList.map((message, i) => {
                    if (i === props.chatMessageList.length - 1)
                        return <SingleTextMessage key={message.uuid} message={message} endRef={scrollToBottomRef} />
                    return <SingleTextMessage key={message.uuid} message={message} />
                })}
                <div ref={scrollToBottomRef} style={{ display: 'none' }}></div>
            </Container>
        </>
    )
}

export default ChatDisplaySection
