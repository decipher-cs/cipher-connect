import { Express } from 'express'
import {
    createUser,
    loginUser,
    logoutUser,
    renewAccessToken,
    returnUserSettings,
    updateGroupImage,
    varifyRefreshToken,
    fetchAllRoomPariticpants,
    returnUserRoomsAndParticipants,
    fetchMessages,
    returnMediaFromFS,
    storeMediaToFS,
    storeAvatarToFS,
    returnAvatarFromFS,
} from './controllers.js'
import { avatar, media } from './server.js'

// To be used for type safety on the client side
const routes = {
    // get: {
    //
    // }
    login: '/login',
    signup: '/signup',
    renewtoken: '/renewtoken',
    logout: '/logout',
    varifyRefreshToken: '/varifyRefreshToken',
    // updateAvatar: '/updateAvatar',
    userSettings: '/userSettings',
    userRoomsAndParticipants: '/userRoomsAndParticipants',
    roomParticipants: '/roomParticipants',
    messages: '/Messages',
    media: '/Media',
    avatar: '/avatar',
} as const

export const initRoutes = (app: Express) => {
    app.all(routes.login, loginUser)
    app.all(routes.signup, createUser)
    app.all(routes.renewtoken, renewAccessToken)
    app.all(routes.logout, logoutUser)
    app.all(routes.varifyRefreshToken, varifyRefreshToken)

    app.post(routes.avatar, avatar, storeAvatarToFS)
    app.get(routes.avatar + '/:path', returnAvatarFromFS)

    app.get(routes.userSettings + '/:username', returnUserSettings)

    app.get(routes.userRoomsAndParticipants + '/:username', returnUserRoomsAndParticipants)
    app.get(routes.roomParticipants, fetchAllRoomPariticpants)

    app.get(routes.messages + '/:roomID', fetchMessages)
    app.get(routes.media + '/:path', returnMediaFromFS)
    app.post(routes.media, media, storeMediaToFS)
}
