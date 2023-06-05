import { Button, Paper, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { memo, useEffect, useRef } from 'react'
// import { MessageList } from '../pages/Chat'
type MessageList = string[]
export interface ChatDisplaySectionProps {
    chatMessageList: MessageList
    fakeScrollDiv: React.MutableRefObject<HTMLDivElement | null>
}

const SingleTextMessage = memo(
    (props: { message: MessageList[number]; endRef: React.RefObject<HTMLDivElement> | null }) => {
        return (
            <>
                <Paper sx={{ width: 'fit-content', p: 1.5, placeSelf: 'flex-end' }} ref={props.endRef}>
                    <Typography>{props.message}</Typography>
                </Paper>
            </>
        )
    }
)

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
                            // key={message.uuid}
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
