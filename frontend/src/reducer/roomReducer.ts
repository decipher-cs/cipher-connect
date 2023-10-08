import { Room } from '../types/prisma.client'
import { RoomDetails, RoomWithParticipants } from '../types/prisma.client'

export type RoomsState = {
    selectedRoom: null | number
    joinedRooms: RoomDetails[]
}

export enum RoomActionType {
    initializeRoom = 'initializeRoom',
    addRoom = 'addRoom',
    removeRoom = 'removeRoom',
    hide = 'hide',
    addParticipants = 'addParticipant',
    removeParticipants = 'removeParticipant',
    changeRoom = 'changeRoom',
    alterRoomProperties = 'alterRoomProperties',
    changeNotificationStatus = 'changeNotificationStatus',
}

export type RoomActions =
    | {
          type: RoomActionType.initializeRoom
          rooms: RoomsState['joinedRooms']
      }
    | {
          type: RoomActionType.addRoom
          room: RoomsState['joinedRooms'][0] | RoomsState['joinedRooms']
      }
    | {
          type: RoomActionType.removeRoom
          roomId: RoomsState['joinedRooms'][0]['roomId']
      }
    | {
          type: RoomActionType.changeRoom
          newRoomIndex: RoomsState['selectedRoom']
      }
    | {
          type: RoomActionType.removeParticipants
          roomId: Room['roomId']
          username: RoomsState['joinedRooms'][0]['participants'][0]['username']
      }
    | {
          type: RoomActionType.addParticipants
          roomId: Room['roomId']
          participants: RoomsState['joinedRooms'][0]['participants']
      }
    | {
          type: RoomActionType.alterRoomProperties
          roomId: Room['roomId']

          //roomId, username, roomtype, and pariticpants should be readonly.
          newRoomProperties: Partial<
              Omit<RoomsState['joinedRooms'][0], 'roomId' | 'roomType' | 'username' | 'participants'>
          >
      }
    | {
          type: RoomActionType.changeNotificationStatus
          roomId: RoomsState['joinedRooms'][0]['roomId']
          unreadMessages: boolean
      }

export const roomReducer: React.Reducer<RoomsState, RoomActions> = (state, action) => {
    const { type } = action

    const room: RoomsState = structuredClone(state)

    const roomIndex = room.selectedRoom
    const selectedRoom = roomIndex !== null ? room.joinedRooms[roomIndex] : null

    switch (type) {
        case RoomActionType.initializeRoom:
            room.joinedRooms = action.rooms
            break

        case RoomActionType.addRoom:
            if (Array.isArray(action.room)) {
                action.room.forEach(r => room.joinedRooms.push(r))
            } else room.joinedRooms.push(action.room)
            break

        case RoomActionType.removeRoom:
            room.joinedRooms = room.joinedRooms.filter(r => r.roomId !== action.roomId)
            if (selectedRoom?.roomId === action.roomId) room.selectedRoom = null

            break
        case RoomActionType.removeParticipants:
            room.joinedRooms.forEach(r => {
                if (r.roomId === action.roomId) {
                    console.log('before', r.participants)
                    r.participants = r.participants.filter(user => user.username !== action.username)
                    console.log('after', r.participants)
                }
            })
            break
        case RoomActionType.addParticipants:
            room.joinedRooms.forEach(room => {
                if (room.roomId === action.roomId) {
                    room.participants = [...room.participants, ...action.participants]
                }
            })
            break

        case RoomActionType.changeRoom:
            // if (action.newRoomIndex === null) room.selectedRoom = undefined!
            room.selectedRoom = action.newRoomIndex
            break

        case RoomActionType.changeNotificationStatus:
            // if (selectedRoom !== null && selectedRoom.roomId === action.roomId) {
            //     selectedRoom.hasUnreadMessages = action.unreadMessages
            // }
            room.joinedRooms.forEach(room => {
                if (room.roomId === action.roomId) room.hasUnreadMessages = action.unreadMessages
            })
            break

        case RoomActionType.alterRoomProperties:
            if (!room.selectedRoom) break
            room.joinedRooms[room.selectedRoom] = {
                ...room.joinedRooms[room.selectedRoom],
                ...action.newRoomProperties,
            }
            break

        default:
            throw new Error('Unknown Error')
    }
    return room
}
