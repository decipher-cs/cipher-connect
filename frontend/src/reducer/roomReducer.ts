import { Message, Room } from '../types/prisma.client'
import { RoomWithParticipants } from '../types/socket'

type StateType = {
    selectedRoom: null | number
    joinedRooms: RoomWithParticipants[]
}

export enum RoomActionType {
    ADD_ROOM = 'addRoom',
    HIDE = 'hide',
    ADD_PARTICIPANT = 'addParticipant',
    CHANGE_ROOM = 'changeRoom',
}

export type RoomActions =
    | {
          type: RoomActionType.ADD_ROOM
          room: RoomWithParticipants | RoomWithParticipants[]
      }
    | {
          type: RoomActionType.CHANGE_ROOM
          newRoomIndex: number
      }
    | {
          type: RoomActionType.ADD_PARTICIPANT
          roomId: string
          participants: string[]
      }

export const roomReducer: React.Reducer<StateType, RoomActions> = (state, action) => {
    const { type } = action

    const room: StateType = structuredClone(state)

    switch (type) {
        case RoomActionType.ADD_ROOM:
            if (Array.isArray(action.room)) {
                action.room.forEach(r => room.joinedRooms.push(r))
            } else room.joinedRooms.push(action.room)
            break

        case RoomActionType.ADD_PARTICIPANT:
            // room.joinedRooms.find(r => r.roomId === action.roomId)
            break

        case RoomActionType.CHANGE_ROOM:
            room.selectedRoom = action.newRoomIndex
            break

        default:
            throw new Error('Unknown Error')
            break
    }
    return room
}
