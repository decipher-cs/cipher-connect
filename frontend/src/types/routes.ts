export const Routes = {
    get: {
        messages: '/Messages',
        roomParticipants: '/roomParticipants',
        userRooms: '/user-rooms',
        users: '/users',
        user: '/user',
    },
    post: {
        avatar: '/avatar',
        media: '/Media',
    },

    login: '/login',
    signup: '/signup',
    renewtoken: '/renewtoken',
    logout: '/logout',
    varifyRefreshToken: '/varify-refresh-token',
} as const
