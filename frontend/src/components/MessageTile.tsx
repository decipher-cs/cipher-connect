import { Download, ArrowForwardRounded, Preview, SmsFailedRounded, ArrowDropDownRounded } from '@mui/icons-material'
import { Avatar, Box, IconButton, InputAdornment, Paper, Skeleton, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MouseEvent, useContext, useEffect, useState } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { useSocket } from '../hooks/useSocket'
import { Message, MessageContentType, Room, RoomType, User, UserWithoutID } from '../types/prisma.client'
import { AudioPlayer } from './AudioPlayer'
import { MessageTilePopover } from './MessageTilePopover'
import { StyledTextField } from './StyledTextField'

export type MessageTileProps = {
    autoScrollToBottomRef: React.RefObject<HTMLDivElement> | null
    message: Message
    user: UserWithoutID
    roomType: RoomType
}

export const MessageTile = ({
    autoScrollToBottomRef,
    roomType,
    user,
    message: { roomId, contentType, content, key: messageKey, senderUsername, createdAt, editedAt },
}: MessageTileProps) => {
    const { username } = useContext(CredentialContext)

    const alignment: 'left' | 'right' = senderUsername === username ? 'right' : 'left'

    const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null)

    const handleClickOnPopoverAnchor = (e: MouseEvent<HTMLButtonElement>) => setPopoverAnchor(e.currentTarget)

    const socket = useSocket()

    const isPopoverOpen = Boolean(popoverAnchor)

    const closePopover = () => setPopoverAnchor(null)

    const [textEditModeEnabled, setTextEditMode] = useState(false)

    const [editableInputValue, setEditableInputValue] = useState(content)

    const handleTextEditConfirm = () => {
        socket.emit('textMessageUpdated', messageKey, editableInputValue.trim(), roomId)
        setTextEditMode(false)
    }

    if (!content) return null

    return (
        <>
            {senderUsername !== username && roomType === RoomType.group ? (
                <Box sx={{ display: 'flex', placeItems: 'center', gap: 2 }}>
                    <Avatar src={user?.avatarPath ?? ''} />
                    {user.username}
                </Box>
            ) : null}
            <Box
                sx={{
                    // borderRadius: alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
                    justifySelf: alignment === 'left' ? 'flex-start' : 'flex-end',
                    background: 'transparent',
                    position: 'relative',
                    maxWidth: '90%',
                    width: 'fit-content',
                }}
            >
                <>
                    <IconButton
                        sx={{ position: 'absolute', right: '0px', top: '0px' }}
                        onClick={handleClickOnPopoverAnchor}
                    >
                        <ArrowDropDownRounded />
                    </IconButton>

                    <MessageTilePopover
                        open={isPopoverOpen}
                        handleClose={closePopover}
                        anchor={popoverAnchor}
                        messageId={messageKey}
                        roomId={roomId}
                        textEditModeEnabled={textEditModeEnabled}
                        toggleEditMode={() => setTextEditMode(p => !p)}
                        contentType={contentType}
                        senderUsername={senderUsername}
                    />
                </>
                {contentType === MessageContentType.text ? (
                    <Paper
                        sx={{
                            px: 4,
                            py: 4,
                            backgroundImage: 'linear-gradient(45deg,#3023AE 0%,#FF0099 100%)',
                            borderRadius: alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
                        }}
                        ref={autoScrollToBottomRef}
                    >
                        {textEditModeEnabled ? (
                            <StyledTextField
                                value={editableInputValue}
                                multiline
                                onChange={e => setEditableInputValue(e.target.value)}
                                onKeyDown={e => (e.key === 'enter' ? handleTextEditConfirm : null)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton onClick={handleTextEditConfirm}>
                                                <ArrowForwardRounded />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        ) : (
                            <Typography sx={{ overflowWrap: 'break-word', color: 'white' }}>{content}</Typography>
                        )}
                    </Paper>
                ) : (
                    <MediaDisplay content={content} contentType={contentType} />
                )}
            </Box>
        </>
    )
}

const MediaDisplay = ({ content, contentType }: Pick<Message, 'contentType' | 'content'>) => {
    // TODO: append file extension and MIME on explicit download. Put a download button.

    const { data: mediaSrc, status } = useQuery({
        queryKey: [content],
        queryFn: () => fetch(content).then(res => res.blob().then(blob => URL.createObjectURL(blob))),
    })

    if (!content || status === 'error')
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
            return <AudioPlayer audioSrc={mediaSrc ?? ''} />

        // TODO: a new component for Type = file
        // File should open in new tab as preview
        // generate a thumnail of the file contents
        case MessageContentType.file:
            return (
                <>
                    {mediaSrc ? (
                        <Box
                            sx={{
                                border: 'solid white 5px',
                                aspectRatio: '2/1',
                                width: '200px',
                                display: 'flex',
                                placeItems: 'center',
                                placeContent: 'center',
                                borderRadius: '20px',
                            }}
                        >
                            <IconButton href={mediaSrc} target='_blank'>
                                <Download />
                            </IconButton>
                            <IconButton href={mediaSrc} target='_blank'>
                                <Preview />
                            </IconButton>
                        </Box>
                    ) : (
                        <Skeleton sx={{ height: 250, aspectRatio: '1/2' }} variant='rounded' animation='wave' />
                    )}
                </>
            )

        case MessageContentType.video:
            return (
                <>
                    {mediaSrc ? (
                        <Box
                            component='video'
                            src={mediaSrc}
                            controls
                            sx={{
                                maxHeight: '40svh',
                                maxWidth: '100%',

                                border: 'solid white 5px',
                                borderRadius: '20px',
                            }}
                        />
                    ) : (
                        <Skeleton sx={{ height: 250, aspectRatio: '4/5' }} variant='rounded' animation='wave' />
                    )}
                </>
            )

        case MessageContentType.image:
            return (
                <>
                    {mediaSrc ? (
                        <Box
                            component='img'
                            src={mediaSrc}
                            loading='lazy'
                            sx={{
                                maxHeight: '30svh',
                                maxWidth: '100%',
                                border: 'solid white 5px',
                                borderRadius: '20px',
                                ':hover': {
                                    // TODO: backdrop and icon with fullscreen button
                                },
                            }}
                        />
                    ) : (
                        <Skeleton sx={{ height: 250, aspectRatio: '4/5' }} variant='rounded' animation='wave' />
                    )}
                </>
            )

        default:
            return null
    }
}
