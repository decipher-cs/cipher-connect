import { Express, Router } from 'express'
import {
    createUser,
    loginUser,
    logoutUser,
    fetchRoomPariticpants,
    fetchMessages,
    returnUsers,
    returnUser,
    test,
    handleGettingRoomDetails,
    handlePrivateRoomCreation,
    handleGroupCreation,
    handleGettingUniqueRoomDetails,
    handleUserLeavesRoom,
    handleUserDeletesRoom,
    handleUserExistsCheck,
    handleNewParticipants,
    handleMessageReadStatusChange,
    handleUserProfileUpdation,
    handleMediaUpload,
    handleAvatarChange,
    handleRoomConfigChange,
    doesValidUserSessionExist,
} from './controllers.js'
import { media } from './server.js'
import { isUserAuthenticated } from './middleware/auth.js'

// To be used for type safety on the client side
const routes = {
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
        roomConfig: '/room-config',
    },
    delete: {
        userRoom: '/user-room',
        room: '/room',
    },
} as const

export const initRoutes = (app: Router) => {
    app.get(routes.get.sessionStatus, doesValidUserSessionExist)

    app.get(routes.get.logout, logoutUser)

    app.get(routes.get.userRooms + '/:username', isUserAuthenticated, handleGettingRoomDetails)

    app.get(routes.get.userRoom + '/:username/:roomId', isUserAuthenticated, handleGettingUniqueRoomDetails)

    app.get(routes.get.users, isUserAuthenticated, returnUsers)

    app.get(routes.get.user + '/:username', isUserAuthenticated, returnUser)

    app.get(routes.get.messages + '/:roomId', isUserAuthenticated, fetchMessages)

    app.get(routes.get.roomParticipants, isUserAuthenticated, fetchRoomPariticpants)

    app.get(routes.get.isUsernameValid + '/:username', isUserAuthenticated, handleUserExistsCheck)

    app.post(routes.post.login, loginUser)

    app.post(routes.post.signup, createUser)

    app.post(routes.post.media, isUserAuthenticated, media, handleMediaUpload)

    app.post(routes.post.avatar, isUserAuthenticated, media, handleAvatarChange)

    app.post(routes.post.privateRoom, isUserAuthenticated, handlePrivateRoomCreation)

    app.post(routes.post.group, isUserAuthenticated, handleGroupCreation)

    app.post(routes.post.participants, isUserAuthenticated, handleNewParticipants)

    app.put(routes.put.messageReadStatus + '/:roomId/:username', isUserAuthenticated, handleMessageReadStatusChange)

    app.put(routes.put.user, isUserAuthenticated, media, handleUserProfileUpdation)

    app.put(routes.put.roomConfig, isUserAuthenticated, handleRoomConfigChange)

    app.delete(routes.delete.userRoom + '/:username/:roomId', isUserAuthenticated, handleUserLeavesRoom)

    app.delete(routes.delete.room + '/:roomId', isUserAuthenticated, handleUserDeletesRoom)

    app.all('/test', test)
}
