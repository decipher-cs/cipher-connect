import {
    DeleteRounded,
    Download,
    EditRounded,
    ForwardRounded,
    MoreHorizRounded,
    Preview,
    SmsFailedRounded,
} from '@mui/icons-material'
import {
    Avatar,
    Box,
    ButtonGroup,
    Dialog,
    IconButton,
    Paper,
    Popover,
    Skeleton,
    SxProps,
    Theme,
    Typography,
} from '@mui/material'
import axios from 'axios'
import { filetypeextension } from 'magic-bytes.js'
import { MouseEvent, useEffect, useState } from 'react'
import { useDialog } from '../hooks/useDialog'
import { useSocket } from '../hooks/useSocket'
import { Message, MessageContentType, Room } from '../types/prisma.client'
import { MediaPreview } from './MediaPreview'

export type MessageTileProps = {
    alignment: 'left' | 'right'
    autoScrollToBottomRef: React.RefObject<HTMLDivElement> | null
    messageKey: Message['key']
} & Pick<Message, 'contentType' | 'content' | 'roomId'>

export const MessageTile = ({
    alignment,
    messageKey,
    autoScrollToBottomRef,
    content,
    contentType,
    roomId,
}: MessageTileProps) => {
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null)

    const handleClickOnPopoverAnchor = (e: MouseEvent<HTMLButtonElement>) => setPopoverAnchor(e.currentTarget)

    const isPopoverOpen = Boolean(popoverAnchor)

    const closePopover = () => setPopoverAnchor(null)

    if (content === undefined || content === null) return null

    return (
        <>
            <Box
                sx={{
                    borderRadius: alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
                    justifySelf: alignment === 'left' ? 'flex-start' : 'flex-end',
                    width: 'fit-content',
                    maxWidth: '80%',
                    backgroundImage: 'linear-gradient(45deg,#3023AE 0%,#FF0099 100%)',
                    position: 'relative',
                }}
            >
                <IconButton sx={{ position: 'absolute', left: '0px', top: '0px' }} onClick={handleClickOnPopoverAnchor}>
                    <MoreHorizRounded />
                </IconButton>

                <MessageTilePopover
                    open={isPopoverOpen}
                    handleClose={closePopover}
                    anchor={popoverAnchor}
                    messageId={messageKey}
                    roomId={roomId}
                />

                {contentType === MessageContentType.text ? (
                    <Paper sx={{ px: 4, py: 3, background: 'transparent' }} ref={autoScrollToBottomRef}>
                        <Typography sx={{ overflowWrap: 'break-word', color: 'white' }}>{content}</Typography>
                    </Paper>
                ) : (
                    <MediaDisplay content={content} contentType={contentType} />
                )}
            </Box>
        </>
    )
}

const MediaDisplay = ({ content, contentType }: Pick<MessageTileProps, 'contentType' | 'content'>) => {
    // TODO: append file extension and MIME on explicit download. Put a download button.
    // TODO: set a  Loader/ skeletor/ spinner while media is being sourced
    const mediaSrc = content

    const commonStyle: SxProps<Theme> = {
        // borderRadius: alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
        // justifySelf: alignment === 'left' ? 'flex-start' : 'flex-end',
        // background: 'transparent',
        // width: 'fit-content',
        // maxWidth: '80%',
    }

    if (!content)
        return (
            <Box
                sx={{
                    px: 4,
                    py: 3,
                    aspectRatio: '2/1',
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
                        // ...commonStyle,
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
                        // ...commonStyle,
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
                            // ...commonStyle,
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

export const MessageTilePopover = ({
    open,
    handleClose,
    anchor,
    messageId,
    roomId,
}: {
    open: boolean
    handleClose: () => void
    anchor: Element | null
    messageId: Message['roomId']
    roomId: Room['roomId']
}) => {
    const socket = useSocket()

    const handleMessageDelete = () => socket.emit('messageDeleted', messageId, roomId)

    const handleMessageEdit = () => {}

    const handleMessageForward = () => {}

    return (
        <Popover
            open={open}
            onClose={handleClose}
            anchorEl={anchor}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <ButtonGroup>
                <IconButton onClick={handleMessageDelete}>
                    <DeleteRounded />
                </IconButton>
                <IconButton>
                    <EditRounded />
                </IconButton>
                <IconButton>
                    <ForwardRounded />
                </IconButton>
            </ButtonGroup>
        </Popover>
    )
}
