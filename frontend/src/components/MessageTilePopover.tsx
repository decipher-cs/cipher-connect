import { DeleteRounded, DownloadRounded, EditOffRounded, EditRounded, ForwardRounded } from '@mui/icons-material'
import {
    ButtonGroup,
    Popover,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    DialogTitle,
} from '@mui/material'
import { memo, useMemo } from 'react'
import { axiosServerInstance } from '../App'
import { useAuth } from '../hooks/useAuth'
import { useDialog } from '../hooks/useDialog'
import { MessageListAction, MessageListActionType } from '../reducer/messageListReducer'
import { Room, Message, MessageContentType, User, UserMessage } from '../types/prisma.client'
import { Routes } from '../types/routes'

type PartialUserRoomConfig = Partial<Omit<UserMessage, 'username' | 'messageKey'>>

const MessageTilePopover = ({
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

    const handleMessageForward = () => {}

    const { handleClose: handleDeleteDialogClose, handleOpen: handleDeleteDialogOpen, dialogOpen } = useDialog()
    console.log(dialogOpen)

    const DeleteMessageDialog = useMemo(() => {
        return (
            <Dialog
                open={dialogOpen}
                onClose={() => {
                    handleDeleteDialogClose()
                    handleClose()
                }}
                fullWidth
            >
                <DialogTitle> Delete Message </DialogTitle>
                <DialogContent dividers>This will delete the selcted {contentType}</DialogContent>
                <DialogActions>
                    <ButtonGroup>
                        <Button
                            onClick={() => {
                                axiosServerInstance
                                    .delete(Routes.delete.message + '/' + messageId)
                                    .then(res => {
                                        if (res.status === 201)
                                            messageDispatcher({
                                                type: MessageListActionType.remove,
                                                messageKey: messageId,
                                                roomId,
                                            })
                                    })
                                    .finally(handleDeleteDialogClose)
                            }}
                        >
                            Delete For All
                        </Button>
                        <Button
                            onClick={() => {
                                axiosServerInstance
                                    .put(Routes.put.userMessage, {
                                        messageKey: messageId,
                                        updatedConfig: { isHidden: true },
                                    } satisfies {
                                        messageKey: string
                                        updatedConfig: PartialUserRoomConfig
                                    })
                                    .then(res => {
                                        if (res.status === 201) {
                                            messageDispatcher({
                                                type: MessageListActionType.editConfig,
                                                messageKey: messageId,
                                                updatedConfig: { isHidden: true },
                                                roomId,
                                            })
                                        }
                                    })
                                    .finally(() => handleDeleteDialogClose())
                            }}
                        >
                            Delete for me
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        )
    }, [dialogOpen, messageId, roomId])

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
            {DeleteMessageDialog}
            <ButtonGroup>
                {senderUsername === username ? (
                    <IconButton
                        onClick={() => {
                            handleDeleteDialogOpen()
                        }}
                    >
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

export default memo(MessageTilePopover)
