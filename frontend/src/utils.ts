import { Message } from './pages/Chat'
import { MessageContentType, MessageWithContentAsBuffer } from './types/prisma.client'

export const arrayBufferToObjectUrlConverter = (buffer: ArrayBuffer | null) => {
    if (buffer === null) return ''
    const file = new File([buffer], 'file_')
    return URL.createObjectURL(file)
}

export const messageTemplate = (
    targetRoomId: string,
    messageContents: MessageWithContentAsBuffer['content'],
    senderUsername: string,
    messageType: MessageContentType,
    key?: string,
    editedAt?: Date,
    createdAt?: Date
): MessageWithContentAsBuffer => {
    return {
        key: key ?? crypto.randomUUID(),
        editedAt: editedAt ?? null,
        senderUsername,
        roomId: targetRoomId,
        contentType: messageType,
        createdAt: createdAt ?? new Date(),
        content: messageContents,
    }
}
