import { Message } from '../types/prisma.client'

type MessageArray = Message[]
// type MessageArray = { [key: string]: Message[] }

export enum MessageListActionType {
    initializeMessages = 'initializeMessages',
    add = 'add',
    remove = 'remove',
    edit = 'edit',
    changeDeliveryStatus = 'changeDeliveryStatus',
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
          updatedMessage: Pick<Message, 'editedAt' | 'content' | 'key'>
      }
    | {
          type: MessageListActionType.changeDeliveryStatus
          messageId: Message['key']
          changeStatusTo: Message['deliveryStatus']
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
            messageList.forEach(message => {
                if (message.key === action.updatedMessage.key) {
                    message.content = action.updatedMessage.content
                    message.editedAt = action.updatedMessage.editedAt
                }
            })
            break

        case MessageListActionType.changeDeliveryStatus:
            messageList.forEach(message => {
                if (message.key === action.messageId) {
                    message.deliveryStatus = action.changeStatusTo
                }
            })
            break

        default:
            throw new Error('Unknown Error')
            break
    }
    return messageList
}
