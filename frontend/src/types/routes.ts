const URL = import.meta.env.VITE_SERVER_URL

export const Routes = {
    get: {
        messages: '/Messages',
        roomParticipants: '/room-participants',
        userRooms: '/user-rooms',
        userRoom: '/user-room',
        users: '/users',
        user: '/user',
        isUsernameValid: '/is-username-valid',
    },
    post: {
        avatar: '/avatar',
        media: '/Media',
        privateRoom: '/private-room',
        group: '/group',
        participants: '/participants',
    },
    put: {
        messageReadStatus: '/message-read-status',
        user: '/user',
    },
    delete: {
        userRoom: '/user-room',
        room: '/room',
    },
    login: '/login',
    signup: '/signup',
    renewtoken: '/renewtoken',
    logout: '/logout',
    varifyRefreshToken: '/varify-refresh-token',
} as const

// TODO: create a function that prefixes URL to default routes
// without manually prefixing it every time at all the places.
