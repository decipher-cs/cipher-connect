import { MessageContentType, MessageWithContentAsBuffer } from '../types/prisma.client'

const INITIAL_STATE = [{}]

type messageTemplate = MessageWithContentAsBuffer
// type messageTemplate = {
//     readonly targetRoomId: string
//     readonly senderUsername: string
//     messageContents: string
//     messageType: MessageContentType
// }

type StateType = typeof INITIAL_STATE
const enum MessageListActionType {
    ADD,
    REMOVE,
    EDIT,
}
type MessageListAction = {
    type: MessageListActionType
    payload: number
}

export const messageListReducer: React.Reducer<StateType, MessageListAction> = (state, action) => {
    const { type, payload } = action
    const messageList = structuredClone(state)
    switch (type) {
        case MessageListActionType.ADD:
            break
        case MessageListActionType.REMOVE:
            break
        case MessageListActionType.EDIT:
            break

        default:
            throw new Error('Unknown Error')
            break
    }
    return messageList
}
