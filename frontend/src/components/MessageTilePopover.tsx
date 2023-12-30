import { DeleteRounded, DownloadRounded, EditOffRounded, EditRounded, ForwardRounded } from '@mui/icons-material'
import { ButtonGroup, Popover, IconButton } from '@mui/material'
import { axiosServerInstance } from '../App'
import { useAuth } from '../hooks/useAuth'
import { MessageListAction, MessageListActionType } from '../reducer/messageListReducer'
import { Room, Message, MessageContentType, User } from '../types/prisma.client'
import { Routes } from '../types/routes'

export const MessageTilePopover = ({
    open,
    handleClose,
    anchor,
    messageId,
    roomId,
    enableEditMode,
    contentType,
    senderUsername,
    messageDispatcher,
}: {
    messageDispatcher: React.Dispatch<MessageListAction>
    open: boolean
    handleClose: () => void
    anchor: Element | null
    messageId: Message['roomId']
    roomId: Room['roomId']
    enableEditMode: () => void
    contentType: Message['contentType']
    senderUsername: User['username']
}) => {
    const {
        authStatus: { username },
    } = useAuth()

    const handleMessageDelete = async () => {
        const res = await axiosServerInstance.delete(Routes.delete.message + '/' + messageId)
        if (res.status === 201) messageDispatcher({ type: MessageListActionType.remove, messageKey: messageId })
        handleClose()
    }

    const handleMessageForward = () => {}

    return (
        <Popover
            open={open}
            onClose={handleClose}
            anchorEl={anchor}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <ButtonGroup>
                {senderUsername === username ? (
                    <IconButton onClick={handleMessageDelete}>
                        <DeleteRounded />
                    </IconButton>
                ) : null}

                {contentType === MessageContentType.text && senderUsername === username ? (
                    <IconButton
                        onClick={() => {
                            enableEditMode()
                            handleClose()
                        }}
                    >
                        <EditRounded />
                    </IconButton>
                ) : null}
                {contentType !== MessageContentType.text ? (
                    <IconButton>
                        <DownloadRounded />
                    </IconButton>
                ) : null}

                <IconButton>
                    <ForwardRounded />
                </IconButton>
            </ButtonGroup>
        </Popover>
    )
}
