import {
    Download,
    ArrowForwardRounded,
    Preview,
    SmsFailedRounded,
    ArrowDropDownRounded,
    MoreRounded,
    MoreHorizRounded,
    CheckRounded,
    DoneAllRounded,
} from '@mui/icons-material'
import {
    Avatar,
    Box,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Skeleton,
    Tooltip,
    Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { MouseEvent, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSocket } from '../hooks/useSocket'
import {
    Message,
    MessageContentType,
    Room,
    MessageDeliveryStatus,
    RoomType,
    User,
    UserWithoutID,
} from '../types/prisma.client'
import { RoomsState } from '../reducer/roomReducer'
import { AudioPlayer } from './AudioPlayer'
import { MessageTilePopover } from './MessageTilePopover'
import { StyledTextField } from './StyledTextField'

export type MessageTileProps = {
    autoScrollToBottomRef: React.RefObject<HTMLDivElement> | null
    message: Message
    // senderUser: User
    roomType: RoomType
    users: RoomsState['usersInfo']
}

export const MessageTile = (props: MessageTileProps) => {
    const { autoScrollToBottomRef, roomType, users, message } = props

    const user = users[message.senderUsername]

    const {
        roomId,
        contentType,
        content,
        key: messageKey,
        senderUsername,
        createdAt,
        editedAt,
        deliveryStatus,
    } = message

    const {
        authStatus: { username, isLoggedIn },
    } = useAuth()

    const [editableInputValue, setEditableInputValue] = useState(content)

    const alignment: 'left' | 'right' = senderUsername === username ? 'right' : 'left'

    const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null)

    const handleClickOnPopoverAnchor = (e: MouseEvent<HTMLElement>) => setPopoverAnchor(e.currentTarget)

    const isPopoverOpen = Boolean(popoverAnchor)

    const [textEditModeEnabled, setTextEditMode] = useState(false)

    const socket = useSocket()

    const handleTextEditConfirm = () => {
        socket.emit('textMessageUpdated', messageKey, editableInputValue.trim(), roomId)
        setTextEditMode(false)
    }

    const closePopover = () => setPopoverAnchor(null)

    const messageDeliveryTimeAndDate = () => {
        const creationDate = new Date(createdAt)

        const midnight = new Date()
        midnight.setHours(0, 0, 0, 0)

        if (creationDate < midnight)
            return creationDate.toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short', hour12: false })
        return creationDate.toLocaleString('en', { timeStyle: 'short', hour12: false })
    }

    if (!content) return null

    return (
        <>
            <Box
                sx={{
                    px: 1.5,
                    ml: alignment === 'left' ? '0px' : 'auto',
                    position: 'relative',
                    py: 1,
                    maxWidth: '90%',
                    width: 'fit-content',
                    display: 'grid',
                    gridTemplateRows: 'auto auto',
                    gridTemplateColumns: 'auto auto auto',
                    columnGap: 0,
                    rowGap: 1,
                    gap: 1.5,
                }}
            >
                {senderUsername !== username && roomType === RoomType.group ? (
                    <>
                        <Avatar src={user?.avatarPath ?? ''} sx={{ gridRow: '1 / 3', width: 45, height: 45 }} />
                        <Typography>{user.username}</Typography>
                    </>
                ) : null}

                <Typography
                    variant='caption'
                    sx={{
                        placeSelf: 'flex-end',
                        gridColumn: roomType === RoomType.group || senderUsername === username ? '3' : '2',
                        gridRow: '1',
                    }}
                    color='grey'
                >
                    {messageDeliveryTimeAndDate()}
                    {editedAt && '(edited)'}
                </Typography>

                <Box
                    sx={{
                        gridRow: '2',
                        gridColumn: '2/span 2',
                        position: 'relative',
                        // display: 'grid'
                    }}
                >
                    {alignment === 'right' ? (
                        <Box
                            sx={{
                                position: 'absolute',
                                display: 'flex',
                                flexFlow: alignment === 'right' ? 'row' : 'row-reverse',
                                top: '0%',
                                bottom: '0%',
                                // insetInline: alignment === 'left' ? 'auto -70px' : '-70px auto',
                                insetInline: '-70px auto',
                                placeItems: 'center',
                            }}
                        >
                            {deliveryStatus === 'delivered' ? (
                                <Tooltip title='Message Sent'>
                                    {/* <CheckRounded color='disabled' /> */}
                                    <DoneAllRounded color='disabled' />
                                </Tooltip>
                            ) : (
                                <Tooltip title='Sending...'>
                                    <CircularProgress size={20} />
                                </Tooltip>
                            )}
                            <IconButton onClick={handleClickOnPopoverAnchor}>
                                <MoreHorizRounded />
                            </IconButton>
                        </Box>
                    ) : null}

                    {contentType === MessageContentType.text ? (
                        <Paper
                            sx={{
                                px: 4,
                                py: 3,
                                backgroundImage:
                                    username === senderUsername
                                        ? 'linear-gradient(45deg,#108ca6,#2c98ca,#45a3ec)'
                                        : '#000',
                                borderRadius: alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
                                color: theme =>
                                    username === senderUsername
                                        ? theme.palette.getContrastText('#108ca6')
                                        : theme.palette.text.primary,
                            }}
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
                                <Typography sx={{ overflowWrap: 'break-word' }}>{content}</Typography>
                            )}
                        </Paper>
                    ) : (
                        <MediaDisplay content={content} contentType={contentType} />
                    )}
                </Box>
            </Box>

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
    )
}

// { content, contentType, key: messageKey, roomId }
// const TextDisplay = ({ message }: { message: Message }) => {
//     const {
//         roomId,
//         contentType,
//         content,
//         key: messageKey,
//         senderUsername,
//         createdAt,
//         editedAt,
//         deliveryStatus,
//     } = message
//
//     return ()
// }

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
                        <Skeleton sx={{ height: 100, aspectRatio: '2/1' }} variant='rounded' animation='wave' />
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
