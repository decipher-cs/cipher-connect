import { Express } from 'express'
import {
    createUser,
    loginUser,
    logoutUser,
    renewAccessToken,
    // returnUserSettings,
    varifyRefreshToken,
    fetchAllRoomPariticpants,
    fetchMessages,
    storeMediaToFS,
    storeAvatarToFS,
    returnUserRooms,
    returnUsers,
    returnUser,
} from './controllers.js'
import { avatar, media } from './server.js'

// To be used for type safety on the client side
const routes = {
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

export const initRoutes = (app: Express) => {
    app.all(routes.login, loginUser)
    app.all(routes.signup, createUser)
    app.all(routes.renewtoken, renewAccessToken)
    app.all(routes.logout, logoutUser)
    app.all(routes.varifyRefreshToken, varifyRefreshToken)

    app.get(routes.get.userRooms + '/:username', returnUserRooms)
    app.get(routes.get.users, returnUsers)
    app.get(routes.get.user + '/:username', returnUser)

    app.get(routes.get.roomParticipants, fetchAllRoomPariticpants)

    app.get(routes.get.messages + '/:roomID', fetchMessages)

    app.post(routes.post.media, media, storeMediaToFS)

    app.post(routes.post.avatar, avatar, storeAvatarToFS)
}
