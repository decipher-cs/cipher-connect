import { DeleteRounded, DownloadRounded, EditOffRounded, EditRounded } from '@mui/icons-material'
import { ButtonGroup, Popover, IconButton } from '@mui/material'
import { useContext } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { useSocket } from '../hooks/useSocket'
import { Room, Message, MessageContentType, User } from '../types/prisma.client'

export const MessageTilePopover = ({
    open,
    handleClose,
    anchor,
    messageId,
    roomId,
    textEditModeEnabled,
    toggleEditMode,
    contentType,
    senderUsername,
}: {
    open: boolean
    handleClose: () => void
    anchor: Element | null
    messageId: Message['roomId']
    roomId: Room['roomId']
    textEditModeEnabled: boolean
    toggleEditMode: () => void
    contentType: Message['contentType']
    senderUsername: User['username']
}) => {
    const socket = useSocket()

    const { username } = useContext(CredentialContext)

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
                {senderUsername === username ? (
                    <IconButton onClick={handleMessageDelete}>
                        <DeleteRounded />
                    </IconButton>
                ) : null}

                {contentType === MessageContentType.text && senderUsername === username ? (
                    <IconButton onClick={toggleEditMode}>
                        {textEditModeEnabled ? <EditOffRounded /> : <EditRounded />}
                    </IconButton>
                ) : null}
                {contentType !== MessageContentType.text ? (
                    <IconButton>
                        <DownloadRounded />
                    </IconButton>
                ) : null}

                {/* <IconButton> */}
                {/*     <ForwardRounded /> */}
                {/* </IconButton> */}
            </ButtonGroup>
        </Popover>
    )
}
