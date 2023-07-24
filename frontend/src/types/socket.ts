import { Socket } from 'socket.io-client'
import { message as Message, room as Room, userRoomParticipation as UserRoomParticipation } from './prisma.client'

export interface ServerToClientEvents {
    noArg: () => void
    withAck: (d: string, callback: (e: number) => void) => void
    updateNetworkList: (users: string[]) => void
    privateMessage: (targetRoomId: string, msg: string, senderUsername: string) => void
    userRoomsUpdated: (rooms: RoomWithParticipants[]) => void
    roomChanged: (room: RoomWithParticipants) => void
    sendingMessages: () => void
    messagesRequested: (messages: Message[]) => void
}

// for socket.on()
export interface ClientToServerEvents {
    privateMessage: (targetRoomId: string, msg: string) => void
    updateNetworkList: (users: string[]) => void
    removeUserFromNetwork: (newConnectionName: string) => void
    roomSelected: (roomId: string) => void
    createNewPrivateRoom: (participant: string, callback: (response: string) => void) => void
    createNewGroup: (participants: string[], displayName: string, callback: (response: string) => void) => void
    addUsersToRoom: (usersToAdd: string[], roomName: string) => void
    messagesRequested: (roomId: string) => void
    leaveRoom: (roomId: string) => void
}

export type SocketWithCustomEvents = Socket<ServerToClientEvents, ClientToServerEvents>
export type Participants = Pick<UserRoomParticipation, 'username'>[]
export type RoomWithParticipants = Room & { participants: Participants }
