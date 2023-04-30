// Model interactes with the database (mySQL) //

import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

export const createNewUser = async (username: string, password_hash: string) => {
    try {
        const returnedData = await prisma.users.create({ data: { username, password_hash } })
        return returnedData
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') return null
        }
        throw err
    }
}

export const getAllUsers = async () => {
    const allUsers = await prisma.users.findMany()
    return allUsers
}

export const deleteAllUsers = async () => {
    const deletedUsers = await prisma.users.deleteMany()
    return deletedUsers
}

export const getUser = async (username: string) => {
    prisma.users.findUnique({
        where: { username },
    })
}

export const getUserHash = async (username: string) => {
    const hash = await prisma.users.findUnique({
        where: { username },
        select: { password_hash: true },
    })
    return hash
}
