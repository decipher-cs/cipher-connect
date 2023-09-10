import { Message } from '../types/prisma.client'
import { RoomWithParticipants } from '../types/socket'

type StateType = {
    selectedRoom: null | number
    joinedRooms: RoomWithParticipants[]
}

export const enum roomActionType {
    ADD = 'add',
    HIDE = 'hide',
    CHANGEROOM = 'changeRoom',
}
export type RoomActions = {
    type: roomActionType
    payload: number
}

export const roomReducer: React.Reducer<StateType, RoomActions> = (state, action) => {
    const { type, payload } = action
    const room: StateType = structuredClone(state)
    switch (type) {
        case roomActionType.ADD:
            break
        case roomActionType.HIDE:
            break
        case roomActionType.CHANGEROOM:
            break

        default:
            throw new Error('Unknown Error')
            break
    }
    return room
}
