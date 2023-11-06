import {
    DeleteRounded,
    Download,
    ArrowForwardRounded,
    EditRounded,
    Preview,
    SmsFailedRounded,
    EditOffRounded,
    ArrowDropDownRounded,
} from '@mui/icons-material'
import { Box, ButtonGroup, IconButton, InputAdornment, Paper, Popover, SxProps, Theme, Typography } from '@mui/material'
import { MouseEvent, useContext, useState } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { useSocket } from '../hooks/useSocket'
import { Message, MessageContentType, Room } from '../types/prisma.client'
import { StyledTextField } from './StyledTextField'

export type MessageTileProps = {
    alignment: 'left' | 'right'
    autoScrollToBottomRef: React.RefObject<HTMLDivElement> | null
    messageKey: Message['key']
    sender: Message['senderUsername']
} & Pick<Message, 'contentType' | 'content' | 'roomId'>

export const MessageTile = ({
    alignment,
    messageKey,
    autoScrollToBottomRef,
    content,
    contentType,
    roomId,
    sender,
}: MessageTileProps) => {
    const { username } = useContext(CredentialContext)

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
                {sender === username ? (
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
                        />
                    </>
                ) : null}

                {contentType === MessageContentType.text ? (
                    <Paper sx={{ px: 4, py: 3, background: 'transparent' }} ref={autoScrollToBottomRef}>
                        {textEditModeEnabled ? (
                            <StyledTextField
                                value={editableInputValue}
                                multiline
                                onChange={e => setEditableInputValue(e.target.value)}
                                onKeyDown={handleTextEditConfirm}
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
    textEditModeEnabled,
    toggleEditMode,
    contentType,
}: {
    open: boolean
    handleClose: () => void
    anchor: Element | null
    messageId: Message['roomId']
    roomId: Room['roomId']
    textEditModeEnabled: boolean
    toggleEditMode: () => void
    contentType: Message['contentType']
}) => {
    const socket = useSocket()

    const handleMessageDelete = () => socket.emit('messageDeleted', messageId, roomId)

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

                {contentType === MessageContentType.text ? (
                    <IconButton onClick={toggleEditMode}>
                        {textEditModeEnabled ? <EditOffRounded /> : <EditRounded />}
                    </IconButton>
                ) : null}

                {/* <IconButton> */}
                {/*     <ForwardRounded /> */}
                {/* </IconButton> */}
            </ButtonGroup>
        </Popover>
    )
}
