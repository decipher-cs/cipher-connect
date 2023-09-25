import { prisma } from "../server.js"

export const deleteAllUsers = async () => {
    const deletedUsers = await prisma.user.deleteMany()
    return deletedUsers
}


export const deleteRefreshToken = async (username: string) => {
    const removedCount = await prisma.refreshToken.deleteMany({ where: { username } })
    return removedCount
}
