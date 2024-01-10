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
    CloseRounded,
    QuestionMarkRounded,
} from '@mui/icons-material'
import {
    Avatar,
    Box,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Skeleton,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { MouseEvent, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react'
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
// import { MessageTilePopover } from './MessageTilePopover'
import { StyledTextField } from './StyledTextField'
import { axiosServerInstance } from '../App'
import { Routes } from '../types/routes'
import { MessageListAction, MessageListActionType } from '../reducer/messageListReducer'
import MessageTilePopover from './MessageTilePopover'

export type MessageTileProps = {
    message: Message
    roomType: RoomType
    users: RoomsState['usersInfo']
    messageDispatcher: React.Dispatch<MessageListAction>
}

export const MessageTile = (props: MessageTileProps) => {
    const { roomType, users, message, messageDispatcher } = props

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
        authStatus: { username },
    } = useAuth()

    const alignment: 'left' | 'right' = senderUsername === username ? 'right' : 'left'

    const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null)

    const handleClickOnPopoverAnchor = (e: MouseEvent<HTMLElement>) => setPopoverAnchor(e.currentTarget)

    const isPopoverOpen = Boolean(popoverAnchor)

    const closePopover = useCallback(() => setPopoverAnchor(null), [setPopoverAnchor])

    const [textEditModeEnabled, setTextEditMode] = useState(false)

    const enableEditMode = useCallback(() => setTextEditMode(true), [setTextEditMode])

    if (!content) return null

    return (
        <>
            <Box
                sx={{
                    px: 1.5,
                    ml: alignment === 'left' ? '0px' : 'auto',
                    position: 'relative',
                    pt: 10,
                    maxWidth: '90%',
                    width: 'fit-content',
                    display: 'grid',
                    gridTemplateRows: 'auto auto',
                    gridTemplateColumns: 'auto auto auto',
                    columnGap: 0,
                    rowGap: 1,
                    gap: 1.8,
                }}
            >
                {roomType === RoomType.group && senderUsername !== username ? (
                    <>
                        <Avatar src={user?.avatarPath ?? ''} sx={{ gridRow: '1 / 3', width: 45, height: 45 }} />
                        <Typography>{user?.username}</Typography>
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
                    {messageDeliveryTimeAndDate(createdAt)}
                    {editedAt && ' (edited) '}
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
                            <MessageDeleveryStatusIcon
                                deliveryStatus={deliveryStatus}
                                messageReadByUsernames={message.readByUsernames}
                            />
                            <IconButton onClick={handleClickOnPopoverAnchor}>
                                <MoreHorizRounded />
                            </IconButton>
                        </Box>
                    ) : null}

                    {contentType === MessageContentType.text ? (
                        <TextDisplay
                            message={message}
                            textEditModeEnabled={textEditModeEnabled}
                            messageDispatcher={messageDispatcher}
                            setTextEditMode={setTextEditMode}
                        />
                    ) : (
                        <MediaDisplay content={content} contentType={contentType} />
                    )}
                </Box>
            </Box>

            <MessageTilePopover
                open={isPopoverOpen}
                messageDispatcher={messageDispatcher}
                handleClose={closePopover}
                anchor={popoverAnchor}
                messageId={messageKey}
                roomId={roomId}
                enableEditMode={enableEditMode}
                contentType={contentType}
                senderUsername={senderUsername}
            />
        </>
    )
}

type TextDisplayProps = {
    message: Message
    textEditModeEnabled: boolean
    setTextEditMode: React.Dispatch<React.SetStateAction<boolean>>
    messageDispatcher: React.Dispatch<MessageListAction>
}
const TextDisplay = (props: TextDisplayProps) => {
    const { message, textEditModeEnabled, setTextEditMode, messageDispatcher } = props
    const { content, senderUsername, key, roomId } = message

    const [editableInputValue, setEditableInputValue] = useState(content)

    const {
        authStatus: { username },
    } = useAuth()

    const alignment: 'left' | 'right' = senderUsername === username ? 'right' : 'left'

    const handleTextEditConfirm = () => {
        setTextEditMode(false)
        messageDispatcher({
            type: MessageListActionType.edit,
            updatedMessage: {
                ...message,
                content: editableInputValue,
                editedAt: new Date(),
                deliveryStatus: 'delivering',
            },
            roomId,
        })
        axiosServerInstance
            .put(Routes.put.textMessage, {
                messageId: key,
                content: editableInputValue,
            })
            .then(res => {
                messageDispatcher({
                    type: MessageListActionType.changeDeliveryStatus,
                    messageId: key,
                    changeStatusTo: 'delivered',
                    roomId,
                })
            })
            .catch(err => {
                messageDispatcher({
                    type: MessageListActionType.changeDeliveryStatus,
                    messageId: key,
                    changeStatusTo: 'failed',
                    roomId,
                })
            })
            .finally(() => {})
    }

    return (
        <>
            {textEditModeEnabled ? (
                <StyledTextField
                    value={editableInputValue}
                    multiline
                    sx={{ width: '800px' }}
                    maxRows={10}
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
                <Paper
                    sx={{
                        px: 4,
                        py: 3,
                        backgroundImage:
                            username === senderUsername ? 'linear-gradient(45deg,#108ca6,#2c98ca,#45a3ec)' : '#000',
                        borderRadius: alignment === 'left' ? '0px 45px 45px 45px' : '45px 0px 45px 45px',
                        color: theme =>
                            username === senderUsername
                                ? theme.palette.getContrastText('#108ca6')
                                : theme.palette.text.primary,
                    }}
                >
                    <Typography sx={{ overflowWrap: 'break-word' }}>{content}</Typography>
                </Paper>
            )}
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

const messageDeliveryTimeAndDate = (createdAt: Date) => {
    const creationDate = new Date(createdAt)

    const midnight = new Date()
    midnight.setHours(0, 0, 0, 0)

    if (creationDate < midnight)
        return creationDate.toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short', hour12: false })
    return creationDate.toLocaleString('en', { timeStyle: 'short', hour12: false })
}

const MessageDeleveryStatusIcon = (props: {
    deliveryStatus: MessageDeliveryStatus
    messageReadByUsernames: NonNullable<Message['readByUsernames']>
}) => {
    const { deliveryStatus, messageReadByUsernames } = props
    if (deliveryStatus === 'delivering')
        return (
            <Tooltip title='Sending...'>
                <CircularProgress size={20} />
            </Tooltip>
        )
    if (deliveryStatus === 'failed')
        return (
            <Tooltip title='failed'>
                <CloseRounded color='disabled' />
            </Tooltip>
        )
    if (deliveryStatus === 'delivered') {
        if (messageReadByUsernames.size <= 0)
            return (
                <Tooltip title='Message Sent'>
                    <CheckRounded color='disabled' />
                </Tooltip>
            )
        if (messageReadByUsernames.size > 0)
            return (
                <Tooltip title='Message Sent And Read'>
                    <DoneAllRounded color='disabled' />
                </Tooltip>
            )
    }

    return <QuestionMarkRounded />
}
