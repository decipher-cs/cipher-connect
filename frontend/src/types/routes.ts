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
