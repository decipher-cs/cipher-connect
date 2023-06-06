import { Button, Paper, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { memo, useContext, useEffect, useRef } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { Message } from '../pages/Chat'

interface SingleTextMessageProps {
    message: Message
    endRef: React.RefObject<HTMLDivElement> | null
}

const SingleTextMessage = memo((props: SingleTextMessageProps) => {
    const { username } = useContext(CredentialContext)

    return (
        <Paper
            sx={{
                width: 'fit-content',
                p: 1.5,
                placeSelf: props.message.senderUsername === username ? 'flex-end' : 'flex-start',
            }}
            ref={props.endRef}
        >
            <Typography>{props.message.content}</Typography>
        </Paper>
    )
})

export interface ChatDisplaySectionProps {
    chatMessageList: Message[]
    fakeScrollDiv: React.MutableRefObject<HTMLDivElement | null>
}

const ChatDisplaySection = (props: ChatDisplaySectionProps) => {
    const scrollToBottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollToBottomRef.current === null) return
        scrollToBottomRef.current.scrollIntoView(true)
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
                    return (
                        <SingleTextMessage
                            key={i}
                            message={message}
                            // If newest message in the list, put ref on it
                            endRef={i === props.chatMessageList.length - 1 ? scrollToBottomRef : null}
                        />
                    )
                })}
                <div ref={scrollToBottomRef} style={{ display: 'none' }}></div>
            </Container>
        </>
    )
}

export default ChatDisplaySection
