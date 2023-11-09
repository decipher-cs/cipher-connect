import { DeleteRounded, EditOffRounded, EditRounded } from '@mui/icons-material'
import { ButtonGroup, Popover, IconButton } from '@mui/material'
import { useSocket } from '../hooks/useSocket'
import { Room, Message, MessageContentType } from '../types/prisma.client'

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
