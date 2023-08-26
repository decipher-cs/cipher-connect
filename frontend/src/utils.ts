import { Message } from './pages/Chat'
import { MessageContentType } from './types/prisma.client'

export const arrayBufferToObjectUrlConverter = (buffer: ArrayBuffer | null) => {
    if (buffer === null) return ''
    const file = new File([buffer], 'file_')
    return URL.createObjectURL(file)
}

export const messageTemplate = (
    targetRoomId: string,
    messageContents: string,
    senderUsername: string,
    messageType: MessageContentType
): Message => {
    return {
        senderUsername,
        roomId: targetRoomId,
        content: messageContents,
        contentType: messageType,
        createdAt: new Date(),
    }
}
