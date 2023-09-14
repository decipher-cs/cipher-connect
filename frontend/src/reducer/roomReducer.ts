import { Message, Room } from '../types/prisma.client'
import { RoomWithParticipants } from '../types/socket'

type RoomsState = {
    selectedRoom: null | number
    joinedRooms: RoomWithParticipants[]
}

export enum RoomActionType {
    INITIALIZE_ROOM = 'initializeRoom',
    ADD_ROOM = 'addRoom',
    HIDE = 'hide',
    ADD_PARTICIPANT = 'addParticipant',
    CHANGE_ROOM = 'changeRoom',
}

export type RoomActions =
    | {
          type: RoomActionType.INITIALIZE_ROOM
          rooms: RoomWithParticipants[]
      }
    | {
          type: RoomActionType.ADD_ROOM
          room: RoomWithParticipants | RoomWithParticipants[]
      }
    | {
          type: RoomActionType.CHANGE_ROOM
          newRoomIndex: RoomsState['selectedRoom']
      }
    | {
          type: RoomActionType.ADD_PARTICIPANT
          roomId: Room['roomId']
          participants: RoomWithParticipants['participants']
      }

export const roomReducer: React.Reducer<RoomsState, RoomActions> = (state, action) => {
    const { type } = action

    const room: RoomsState = structuredClone(state)

    switch (type) {
        case RoomActionType.INITIALIZE_ROOM:
            room.joinedRooms = action.rooms
            break
        case RoomActionType.ADD_ROOM:
            if (Array.isArray(action.room)) {
                action.room.forEach(r => room.joinedRooms.push(r))
            } else room.joinedRooms.push(action.room)
            break

        case RoomActionType.ADD_PARTICIPANT:
            // room.joinedRooms.find(r => r.roomId === action.roomId)
            break

        case RoomActionType.CHANGE_ROOM:
            // if (action.newRoomIndex === null) room.selectedRoom = undefined!
            room.selectedRoom = action.newRoomIndex
            break

        default:
            throw new Error('Unknown Error')
            break
    }
    return room
}
