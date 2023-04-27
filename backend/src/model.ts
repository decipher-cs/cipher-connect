import { Prisma, PrismaClient, users } from '@prisma/client'
const prisma = new PrismaClient()

export const createNewUser = async (username: string, salt: string) => {
    const returnedData = await prisma.users.create({
        data: {
            username,
            password_hash: crypto.randomUUID().toString().slice(10),
            salt,
        },
    })
    return returnedData
}

export const getAllUsers = async () => {
    const allUsers = await prisma.users.findMany()
    return allUsers
}

export const deleteAllUsers = async () => {
    const deletedUsers = await prisma.users.deleteMany()
    return deletedUsers
}
