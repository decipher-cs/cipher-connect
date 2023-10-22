import { Download, Preview, SmsFailedRounded } from '@mui/icons-material'
import { Avatar, Dialog, IconButton, Paper, Skeleton, Typography } from '@mui/material'
import { filetypeextension } from 'magic-bytes.js'
import { useEffect, useState } from 'react'
import { Message, MessageContentType } from '../types/prisma.client'

export const MessageTile = (
    props: {
        alignment: 'left' | 'right'
        autoScrollToBottomRef: React.RefObject<HTMLDivElement> | null
    } & Pick<Message, 'contentType' | 'content'>
) => {
    const [showDialog, setShowDialog] = useState(false)

    if (props.content.length <= 0) return null

    if (props.contentType === MessageContentType.text)
        return (
            <Paper
                sx={{
                    borderRadius: props.alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
                    px: 4,
                    py: 3,
                    justifySelf: props.alignment === 'left' ? 'flex-start' : 'flex-end',
                    width: 'fit-content',
                    maxWidth: '80%',
                    backgroundImage: 'linear-gradient(45deg,#3023AE 0%,#FF0099 100%)',
                }}
                ref={props.autoScrollToBottomRef}
            >
                <Typography sx={{ overflowWrap: 'break-word', color: 'white' }}>{props.content}</Typography>
            </Paper>
        )
    else {
        return (
            <Paper
                style={{
                    justifySelf: props.alignment === 'left' ? 'flex-start' : 'flex-end',
                    maxWidth: '80%',
                    aspectRatio: '3/4',
                    height: '30svh',

                    backgroundImage: 'linear-gradient(45deg,#3023AE 0%,#FF0099 100%)',
                    display: 'grid',
                    placeContent: 'center',
                }}
                ref={props.autoScrollToBottomRef}
                onClick={() => setShowDialog(true)}
            >
                {/* TODO: new component for previeing // <Preview/> */}
                {/* <Dialog fullscreen open={showDialog} onClick={() => setShowDialog(false)}> */}
                {/* </Dialog> */}
                <Content content={props.content} contentType={props.contentType} /* MIME={props.MIME} */ />
            </Paper>
        )
    }
}

const Content = ({ content, contentType }: Pick<Message, 'contentType' | 'content'>) => {
    // TODO: set a  Loader/ skeletor/ spinner

    // content is the full path to the file on the server storage. Ex: folderName/randomFileBytes, media/aj3qfeq2rf3a32f3th5

    // TODO: put a placeholder/ broken for missing content

    // if (!MIME || !content) return <SmsFailedRounded />
    if (!content) return <SmsFailedRounded />

    // TODO: append file extension and MIME on explicit download. Put a download button.
    // const file = new File([fetchMedia.data], crypto.randomUUID() + extension, { type: MIME })

    const mediaSrc = import.meta.env.VITE_MEDIA_STORAGE_URL + content

    switch (contentType) {
        case MessageContentType.audio:
            return <audio controls src={mediaSrc} />

        // TODO: a new component for Type = file
        // File should open in new tab as preview
        // generate a thumnail of the file contents
        case MessageContentType.file:
            return (
                <>
                    <IconButton href={mediaSrc} target='_blank'>
                        <Download />
                    </IconButton>
                    <IconButton href={mediaSrc} target='_blank'>
                        <Preview />
                    </IconButton>
                </>
            )

        case MessageContentType.video:
            return <video src={mediaSrc} controls style={{ maxHeight: '30svh' }} />

        case MessageContentType.image:
            return (
                <>
                    <img
                        src={mediaSrc}
                        loading='lazy'
                        style={{
                            maxHeight: '30svh',
                            maxWidth: '100%',
                        }}
                    />
                </>
            )

        default:
            return null
    }
}
