import { Download, Preview, SmsFailedRounded } from '@mui/icons-material'
import { Avatar, Box, Dialog, IconButton, Paper, Skeleton, SxProps, Theme, Typography } from '@mui/material'
import axios from 'axios'
import { filetypeextension } from 'magic-bytes.js'
import { useEffect, useState } from 'react'
import { useDialog } from '../hooks/useDialog'
import { Message, MessageContentType } from '../types/prisma.client'
import { MediaPreview } from './MediaPreview'

export type MessageTileProps = {
    alignment: 'left' | 'right'
    autoScrollToBottomRef: React.RefObject<HTMLDivElement> | null
} & Pick<Message, 'contentType' | 'content'>

export const MessageTile = ({ alignment, autoScrollToBottomRef, content, contentType }: MessageTileProps) => {
    const [showDialog, setShowDialog] = useState(false)

    const { handleOpen, handleClose, dialogOpen } = useDialog()

    if (content === undefined || content === null) return null

    if (contentType === MessageContentType.text)
        return (
            <Paper
                sx={{
                    borderRadius: alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
                    px: 4,
                    py: 3,
                    justifySelf: alignment === 'left' ? 'flex-start' : 'flex-end',
                    width: 'fit-content',
                    maxWidth: '80%',
                    backgroundImage: 'linear-gradient(45deg,#3023AE 0%,#FF0099 100%)',
                }}
                ref={autoScrollToBottomRef}
            >
                <Typography sx={{ overflowWrap: 'break-word', color: 'white' }}>{content}</Typography>
            </Paper>
        )
    else {
        return <MediaDisplay content={content} contentType={contentType} alignment={alignment} />
    }
}

const MediaDisplay = ({
    alignment,
    content,
    contentType,
}: Pick<MessageTileProps, 'contentType' | 'content'> & { alignment: 'left' | 'right' }) => {
    // TODO: append file extension and MIME on explicit download. Put a download button.
    // const file = new File([fetchMedia.data], crypto.randomUUID() + extension, { type: MIME })
    // console.log(file)

    // TODO: set a  Loader/ skeletor/ spinner while media is being sourced
    const mediaSrc = import.meta.env.VITE_MEDIA_STORAGE_URL + content
    // console.log(mediaSrc)
    // axios
    //     .get(mediaSrc, {
    //         withCredentials: true
    //     })
    //     .then(data => {
    //         console.log(data)
    //         // return data.arrayBuffer()
    //     })
    // .then(ab => {
    //     const fo = new Uint8Array(ab)
    //     console.log('expesion:', filetypeextension(fo))
    // })

    const commonStyle: SxProps<Theme> = {
        borderRadius: alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
        justifySelf: alignment === 'left' ? 'flex-start' : 'flex-end',
        background: 'transparent',
        width: 'fit-content',
        maxWidth: '80%',
    }

    if (!content)
        return (
            <Box
                sx={{
                    borderRadius: alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
                    justifySelf: alignment === 'left' ? 'flex-start' : 'flex-end',
                    px: 4,
                    py: 3,
                    aspectRatio: '2/1',
                    backgroundImage: 'linear-gradient(45deg,#3023AE 0%,#FF0099 100%)',
                    display: 'flex',
                    placeContent: 'center',
                }}
            >
                <SmsFailedRounded fontSize='large' />
            </Box>
        )

    switch (contentType) {
        case MessageContentType.audio:
            return <Box component='audio' controls src={mediaSrc} />

        // TODO: a new component for Type = file
        // File should open in new tab as preview
        // generate a thumnail of the file contents
        case MessageContentType.file:
            return (
                <Box
                    sx={{
                        ...commonStyle,
                        border: 'solid white 8px',
                        aspectRatio: '2/1',
                        width: '200px',
                        display: 'flex',
                        placeItems: 'center',
                        placeContent: 'center',
                        // borderRadius: '20px',
                    }}
                >
                    <IconButton href={mediaSrc} target='_blank'>
                        <Download />
                    </IconButton>
                    <IconButton href={mediaSrc} target='_blank'>
                        <Preview />
                    </IconButton>
                </Box>
            )

        case MessageContentType.video:
            return (
                <Box
                    component='video'
                    src={mediaSrc}
                    controls
                    sx={{
                        ...commonStyle,
                        maxHeight: '40svh',
                        maxWidth: '100%',

                        border: 'solid white 8px',
                        borderRadius: '20px',
                    }}
                />
            )

        case MessageContentType.image:
            return (
                <>
                    <Box
                        component='img'
                        src={mediaSrc}
                        loading='lazy'
                        sx={{
                            ...commonStyle,
                            maxHeight: '30svh',
                            maxWidth: '100%',
                            border: 'solid white 8px',
                            borderRadius: '20px',
                            ':hover': {
                                // TODO: backdrop and icon with fullscreen button
                            },
                        }}
                    />
                </>
            )

        default:
            return null
    }
}
