import { ProfileFormValues } from '../components/ProfileSettingsDialog'
import { RoomType, UserStatus, UserWithoutID } from '../types/prisma.client'
import { z } from 'zod'
import validator from 'validator'
import { axiosServerInstance } from '../App'
import { Routes } from '../types/routes'

export const roomCreationFormValidation = z.union([
    z.object({
        roomType: z.enum([RoomType.private]),
        roomDisplayName: z.string().optional(),
        participants: z
            .array(
                z.object({
                    username: z.string().optional().default(''),
                })
            )
            .nonempty()
            .max(20)
            .refine(usernames => usernames[0].username.length >= 3 && usernames[0].username.length <= 16, {
                message: 'String must be between 3 and 16 characters',
                path: [0, 'username'],
            })
            .refine(
                async usernames => {
                    const response = await axiosServerInstance.get<boolean>(
                        Routes.get.isUsernameValid + '/' + usernames[0].username
                    )
                    return response.data
                },
                {
                    message: 'username does not exist',
                    path: [0, 'username'],
                }
            ),
    }),
    z.object({
        roomType: z.enum([RoomType.group]),
        roomDisplayName: z.string().min(3).max(16),
        participants: z
            .array(
                z.object({
                    username: z.string().min(3).max(16).default(''),
                })
            )
            .nonempty()
            .max(20)
            .superRefine(async (usernames, ctx) => {
                for (const i in usernames) {
                    const response = await axiosServerInstance.get<boolean>(
                        Routes.get.isUsernameValid + '/' + usernames[i].username
                    )
                    if (response.data === false)
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `username does not exist`,
                            path: [i, 'username'],
                        })
                }
            }),
    }),
])

export const userProfileUpdationFormValidation: z.ZodType<ProfileFormValues> = z.object({
    displayName: z.string().min(3).max(16).optional().or(z.literal('')),
    status: z.union([z.literal(UserStatus.dnd), z.literal(UserStatus.available), z.literal(UserStatus.hidden)]),
    avatar: z.instanceof(File).optional(),
})

export const loginAndSignupValidation = z.object({
    username: z.string().min(3).max(16).trim().refine(validator.isAlphanumeric),
    password: import.meta.env.PROD
        ? z.string().min(8).max(50).refine(validator.isStrongPassword)
        : z.string().min(8).max(50),
})

export const userListValidation = z.object({
    usernames: z
        .object({
            username: z
                .string()
                .min(3)
                .max(16)
                .refine(
                    async username => {
                        if (username.length < 3) return false
                        try {
                            const response = await axiosServerInstance.get<boolean>(
                                Routes.get.isUsernameValid + '/' + username
                            )
                            return response.data
                        } catch (err) {
                            return false
                        }
                    },
                    { message: 'Invalid username' }
                ),
        })
        .array()
        .nonempty(),
})
