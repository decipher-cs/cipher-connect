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
    doesValidUserSessionExist,
    isServerOnline,
    handleUserRoomOptionsChange,
} from './controllers.js'
import { media } from './server.js'
import { isUserAuthenticated } from './middleware/auth.js'
import { Routes as routes } from '../../@types/ExpressRoutes.js'
import { uploadMediaToUploadthing } from './middleware/uploadToUploadthing.js'

export const initRoutes = (app: Router) => {
    app.get(routes.get.sessionStatus, doesValidUserSessionExist)

    app.get(routes.get.logout, logoutUser)

    app.get(routes.get.users, isUserAuthenticated, returnUsers)

    app.get(routes.get.userRooms + '/:username', isUserAuthenticated, handleGettingRoomDetails)

    app.get(routes.get.userRoom + '/:username/:roomId', isUserAuthenticated, handleGettingUniqueRoomDetails)

    app.get(routes.get.user + '/:username', isUserAuthenticated, returnUser)

    app.get(routes.get.messages + '/:roomId', isUserAuthenticated, fetchMessages)

    app.get(routes.get.roomParticipants, isUserAuthenticated, fetchRoomPariticpants)

    app.get(routes.get.isUsernameValid + '/:username', isUserAuthenticated, handleUserExistsCheck)

    app.post(routes.post.login, loginUser)

    app.post(routes.post.signup, createUser)

    app.post(routes.post.media, isUserAuthenticated, media, uploadMediaToUploadthing, handleMediaUpload)

    app.post(routes.post.avatar, isUserAuthenticated, media, uploadMediaToUploadthing, handleAvatarChange)

    app.post(routes.post.privateRoom, isUserAuthenticated, handlePrivateRoomCreation)

    app.post(routes.post.group, isUserAuthenticated, handleGroupCreation)

    app.post(routes.post.participants, isUserAuthenticated, handleNewParticipants)

    app.put(routes.put.messageReadStatus + '/:roomId/:username', isUserAuthenticated, handleMessageReadStatusChange)

    app.put(routes.put.user, isUserAuthenticated, media, uploadMediaToUploadthing, handleUserProfileUpdation)

    app.put(routes.put.userRoom, isUserAuthenticated, handleUserRoomOptionsChange)

    app.delete(routes.delete.userRoom + '/:username/:roomId', isUserAuthenticated, handleUserLeavesRoom)

    app.delete(routes.delete.room + '/:roomId', isUserAuthenticated, handleUserDeletesRoom)

    app.all('/test', test)
}
