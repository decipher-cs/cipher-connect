import { Message } from '../types/prisma.client'

type MessageArray = Message[]
// type MessageArray = { [key: string]: Message[] }

export enum MessageListActionType {
    initializeMessages = 'initializeMessages',
    add = 'add',
    append = 'append',
    prepend = 'prepend',
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
          newMessage: Message | Message[]
      }
    | {
          type: MessageListActionType.append
          newMessage: Message[]
      }
    | {
          type: MessageListActionType.prepend
          newMessage: Message[]
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

    const messageList = state

    switch (type) {
        case MessageListActionType.initializeMessages:
            return [...action.newMessages]

        case MessageListActionType.add:
            if (Array.isArray(action.newMessage)) return [...messageList, ...action.newMessage]
            else return [...messageList, action.newMessage]

        case MessageListActionType.append:
            return [...messageList, ...action.newMessage]

        case MessageListActionType.prepend:
            return [...action.newMessage, ...messageList]

        case MessageListActionType.remove:
            return messageList.filter(({ key }) => key !== action.messageKey)

        case MessageListActionType.edit:
            messageList.forEach((message, i) => {
                if (message.key === action.updatedMessage.key) {
                    messageList[i].content = action.updatedMessage.content
                    messageList[i].editedAt = action.updatedMessage.editedAt
                }
            })
            return messageList

        case MessageListActionType.changeDeliveryStatus:
            messageList.forEach((message, i) => {
                if (message.key === action.messageId) {
                    messageList[i] = { ...messageList[i], deliveryStatus: action.changeStatusTo }
                }
            })
            return messageList

        default:
            throw new Error('Unknown Error')
            break
    }
}
