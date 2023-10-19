import { object, string, number, ObjectSchema, array, boolean, InferType, addMethod, mixed } from 'yup'
import { InitialFormValues } from '../components/CreateRoomDialog'
import { ProfileFormValues } from '../components/ProfileSettingsDialog'
import { RoomType, UserStatus, UserWithoutID } from '../types/prisma.client'
import { z } from 'zod'

export const newRoomFormValidation: ObjectSchema<InitialFormValues> = object().shape({
    roomType: string()
        .default(RoomType.private)
        .oneOf([RoomType.private, RoomType.group], 'room can only be of type group or private')
        .required('This is a required value'),

    participants: array()
        .of(
            object({
                username: string()
                    .required('Cannot be empty')
                    .min(3, 'Need at least 3 characters')
                    .max(16, 'maximum 16 characters allowed')
                    .test(
                        'username-validity-testk',
                        'Username does not exist or is allowing requests',
                        async username => {
                            // TODO: check if user exists on DB
                            return true
                        }
                    ),
            })
        )
        .required('Cannot be empty')
        .when('roomType', {
            is: (type: RoomType) => type === RoomType.private,
            then: schema => schema.length(1, 'Need at least one username'),
        })
        .test('uniqueness-test', 'Duplicate username detected', values => {
            const usernames = values.map(({ username }) => username)
            return usernames.length === new Set(usernames).size
        })
        .min(1, 'Need at least one username'),

    roomDisplayName: string()
        .default('')
        .when('roomType', {
            is: (type: RoomType) => type === RoomType.group,
            then(schema) {
                return schema.required().min(3, 'Min 3 characters needed').max(16, 'Max 16 characters allowed').trim()
            },
        }),
})

export const userProfileUpdationFormValidation: z.ZodType<ProfileFormValues> = z.object({
    displayName: z.string().min(3).max(16).optional().or(z.literal('')),
    status: z.union([z.literal(UserStatus.dnd), z.literal(UserStatus.available), z.literal(UserStatus.hidden)]),
    avatar: z.instanceof(File).optional(),
})
