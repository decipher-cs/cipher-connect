import { Message } from '../types/prisma.client'

type MessageArray = Message[]
// type MessageArray = { [key: string]: Message[] }

export enum MessageListActionType {
    initializeMessages = 'initializeMessages',
    add = 'add',
    remove = 'remove',
    edit = 'edit',
}
export type MessageListAction =
    | {
          type: MessageListActionType.initializeMessages
          newMessages: Message[]
      }
    | {
          type: MessageListActionType.add
          newMessage: Message | Message[] // TODO: accespt URL objects and files
      }
    | {
          type: MessageListActionType.remove
          messageKey: Message['key']
      }
    | {
          type: MessageListActionType.edit
          payload: Pick<Message, 'editedAt' | 'content'> & { index: number }
      }

export const messageListReducer: React.Reducer<MessageArray, MessageListAction> = (state, action) => {
    const { type } = action

    let messageList: MessageArray = structuredClone(state)

    switch (type) {
        case MessageListActionType.initializeMessages:
            messageList = action.newMessages
            break

        case MessageListActionType.add:
            if (Array.isArray(action.newMessage)) messageList.push(...action.newMessage)
            else messageList.push(action.newMessage)

            break

        case MessageListActionType.remove:
            messageList = messageList.filter(({ key }) => key !== action.messageKey)
            break

        case MessageListActionType.edit:
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
