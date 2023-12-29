// To be used for type safety on the client side
export const Routes = {
    all: {
        healthCheck: '/health-check',
    },
    get: {
        messages: '/Messages',
        roomParticipants: '/room-participants',
        userRooms: '/user-rooms',
        userRoom: '/user-room',
        users: '/users',
        user: '/user',
        isUsernameValid: '/is-username-valid',
        logout: '/logout',
        sessionStatus: '/session-status',
        messageCount: '/message-count',
    },
    post: {
        login: '/login',
        signup: '/signup',
        avatar: '/avatar',
        media: '/Media',
        privateRoom: '/private-room',
        group: '/group',
        participants: '/participants',
    },
    put: {
        messageReadStatus: '/message-read-status',
        user: '/user',
        userRoom: '/user-room',
        personalUserRoomConfig: '/personal-user-room-config',
        sharedUserRoomConfig: '/shared-user-room-config',
        room: '/room',
    },
    delete: {
        userRoom: '/user-room',
        room: '/room',
    },
} as const
