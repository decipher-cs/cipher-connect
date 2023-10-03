import { Message } from '../types/prisma.client'

type MessageArray = Message[]


export enum MessageListActionType {
    INITIALIZE_MESSAGES = 'initializeMessages',
    ADD = 'add',
    REMOVE = 'remove',
    EDIT = 'edit',
}
export type MessageListAction =
    | {
          type: MessageListActionType.INITIALIZE_MESSAGES
          newMessages: Message[]
      }
    | {
          type: MessageListActionType.ADD
          newMessage: Message | Message[] // TODO: accespt URL objects and files
      }
    | {
          type: MessageListActionType.REMOVE
          index: number
      }
    | {
          type: MessageListActionType.EDIT
          payload: Pick<Message, 'editedAt' | 'content'> & { index: number }
      }

export const messageListReducer: React.Reducer<MessageArray, MessageListAction> = (state, action) => {
    const { type } = action
    let messageList: MessageArray = structuredClone(state)
    switch (type) {
        case MessageListActionType.INITIALIZE_MESSAGES:
            messageList = action.newMessages
            break
        case MessageListActionType.ADD:
            if (Array.isArray(action.newMessage)) messageList.push(...action.newMessage)
            else messageList.push(action.newMessage)

            break
        case MessageListActionType.REMOVE:
            messageList.splice(action.index)
            break
        case MessageListActionType.EDIT:
            // TODO: make sure content type is the same as before
            messageList[action.payload.index].editedAt = new Date()
            messageList[action.payload.index].content = action.payload.content
            break

        default:
            throw new Error('Unknown Error')
            break
    }
    return messageList
}
