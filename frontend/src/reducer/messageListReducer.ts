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
    clearMessageList = 'clearMessageList',
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
          updatedMessage: Pick<Message, 'editedAt' | 'content' | 'key' | 'deliveryStatus'>
      }
    | {
          type: MessageListActionType.changeDeliveryStatus
          messageId: Message['key']
          changeStatusTo: Message['deliveryStatus']
      }
    | {
          type: MessageListActionType.clearMessageList
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
            const { updatedMessage } = action
            return messageList.map((message, i) => {
                if (message.key === action.updatedMessage.key) {
                    const msg = { ...message, ...updatedMessage }
                    return msg
                } else return message
            })

        case MessageListActionType.changeDeliveryStatus:
            return messageList.map((message, i) => {
                if (message.key === action.messageId) {
                    return { ...messageList[i], deliveryStatus: action.changeStatusTo }
                } else return message
            })

        case MessageListActionType.clearMessageList:
            return []

        default:
            throw new Error('Unknown Error')
    }
}
