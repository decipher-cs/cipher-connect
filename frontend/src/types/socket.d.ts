import { message, room } from './prisma.client'

export interface ServerToClientEvents {
    noArg: () => void
    withAck: (d: string, callback: (e: number) => void) => void
    updateNetworkList: (users: string[]) => void
    privateMessage: (msg: string) => void
    userRoomsUpdated: (rooms: room[]) => void
    roomChanged: (roomId: string) => void
}

// for socket.on()
export interface ClientToServerEvents {
    privateMessage: (msg: string) => void
    updateNetworkList: (users: string[]) => void
    removeUserFromNetwork: (newConnectionName: string) => void // might wanna use acknowledgment here
    roomSelected: (roomId: string) => void
    createNewRoom: (participant: string, callback: (response: null | string) => void) => void
    addUsersToRoom: (usersToAdd: string[], roomName: string) => void
}
