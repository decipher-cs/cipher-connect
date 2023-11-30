import { Express } from 'express'
import {
    createUser,
    loginUser,
    logoutUser,
    // renewAccessToken,
    // varifyRefreshToken,
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
} from './controllers.js'
import { media } from './server.js'

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

export const initRoutes = (app: Express) => {
    app.get(routes.get.logout, logoutUser)

    app.get(routes.get.userRooms + '/:username', handleGettingRoomDetails)

    app.get(routes.get.userRoom + '/:username/:roomId', handleGettingUniqueRoomDetails)

    app.get(routes.get.users, returnUsers)

    app.get(routes.get.user + '/:username', returnUser)

    app.get(routes.get.roomParticipants, fetchRoomPariticpants)

    app.get(routes.get.messages + '/:roomId', fetchMessages)

    app.get(routes.get.isUsernameValid + '/:username', handleUserExistsCheck)

    app.post(routes.post.login, loginUser)

    app.post(routes.post.signup, createUser)

    app.post(routes.post.media, media, handleMediaUpload)

    app.post(routes.post.avatar, media, handleAvatarChange)

    app.post(routes.post.privateRoom, handlePrivateRoomCreation)

    app.post(routes.post.group, handleGroupCreation)

    app.post(routes.post.participants, handleNewParticipants)

    app.put(routes.put.messageReadStatus + '/:roomId/:username', handleMessageReadStatusChange)

    app.put(routes.put.user, media, handleUserProfileUpdation)

    app.put(routes.put.roomConfig, handleRoomConfigChange)

    app.delete(routes.delete.userRoom + '/:username/:roomId', handleUserLeavesRoom)

    app.delete(routes.delete.room + '/:roomId', handleUserDeletesRoom)

    app.all('/test', test)
}
