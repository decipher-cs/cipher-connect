import { produce } from 'immer'
import { Message, Room } from '../types/prisma.client'

export type EveryRoomMessage = { readonly [roomId: string]: Message[] }

export enum MessageListActionType {
    initializeMessages = 'initializeMessages',
    add = 'add',
    append = 'append',
    prepend = 'prepend',
    remove = 'remove',
    edit = 'edit',
    editConfig = 'editOptions',
    clearMessageList = 'clearMessageList',
    changeDeliveryStatus = 'changeDeliveryStatus',
}
export type MessageListAction =
    | {
          type: MessageListActionType.initializeMessages
          newMessages: Message[]
          roomId: Room['roomId']
      }
    | {
          type: MessageListActionType.add
          newMessage: Message | Message[]
          roomId: Room['roomId']
      }
    | {
          type: MessageListActionType.append
          newMessage: Message[]
          roomId: Room['roomId']
      }
    | {
          type: MessageListActionType.prepend
          newMessage: Message[]
          roomId: Room['roomId']
      }
    | {
          type: MessageListActionType.remove
          messageKey: Message['key']
          roomId: Room['roomId']
      }
    | {
          type: MessageListActionType.edit
          updatedMessage: Pick<Message, 'editedAt' | 'content' | 'key' | 'deliveryStatus'>
          roomId: Room['roomId']
      }
    | {
          type: MessageListActionType.editConfig
          updatedConfig: Omit<Message['messageOptions'], 'roomId' | 'username'>
          messageKey: Message['key']
          roomId: Room['roomId']
      }
    | {
          type: MessageListActionType.changeDeliveryStatus
          messageId: Message['key']
          changeStatusTo: Message['deliveryStatus']
          roomId: Room['roomId']
      }
    | {
          type: MessageListActionType.clearMessageList
          roomId: Room['roomId']
      }

export const messageListReducer: React.Reducer<EveryRoomMessage, MessageListAction> = (state, action) => {
    const { type } = action

    const messages = state

    switch (type) {
        case MessageListActionType.initializeMessages:
            return produce(messages, draft => {
                draft[action.roomId] = action.newMessages
            })

        case MessageListActionType.add:
            return produce(messages, draft => {
                draft[action.roomId] = draft[action.roomId]?.concat(action.newMessage) ?? []
            })

        case MessageListActionType.append:
            return produce(messages, draft => {
                draft[action.roomId]?.push(...action.newMessage)
            })

        case MessageListActionType.prepend:
            return produce(messages, draft => {
                draft[action.roomId]?.unshift(...action.newMessage)
            })

        case MessageListActionType.remove:
            return produce(messages, draft => {
                draft[action.roomId]?.forEach((message, i) => {
                    if (message.key === action.messageKey) {
                        if (message.messageOptions) message.messageOptions.isHidden = true
                        else
                            message.messageOptions = {
                                messageKey: message.key,
                                username: message.senderUsername,
                                isHidden: true,
                                isNotificationMuted: false,
                                isMarkedFavourite: false,
                                isPinned: false,
                            }
                    }
                })
            })

        case MessageListActionType.editConfig:
            return produce(messages, draft => {
                draft[action.roomId]?.forEach(message => {
                    if (message.key === action.messageKey)
                        if (message.messageOptions)
                            message.messageOptions = { ...message.messageOptions, ...action.updatedConfig }
                        else
                            message.messageOptions = {
                                messageKey: message.key,
                                username: message.senderUsername,
                                isHidden: false,
                                isNotificationMuted: false,
                                isMarkedFavourite: false,
                                isPinned: false,
                                ...action.updatedConfig,
                            }
                })
            })

        case MessageListActionType.edit:
            return produce(messages, draft => {
                draft[action.roomId]?.forEach(message => {
                    if (message.key === action.updatedMessage.key) message = { ...message, ...action.updatedMessage }
                })
            })

        case MessageListActionType.changeDeliveryStatus:
            return produce(messages, draft => {
                draft[action.roomId]?.forEach(message => {
                    if (message.key === action.messageId) message.deliveryStatus = action.changeStatusTo
                })
            })

        case MessageListActionType.clearMessageList:
            return produce(messages, draft => {
                draft[action.roomId] = []
            })

        default:
            throw new Error('Unknown Error')
    }
}
