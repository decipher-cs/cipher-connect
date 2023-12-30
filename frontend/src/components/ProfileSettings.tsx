import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import React, { PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'
import { User, UserStatus, UserWithoutID } from '../types/prisma.client'
import { Routes } from '../types/routes'
import { StyledTextField } from './StyledTextField'
import { CloudUploadRounded, FaceRounded } from '@mui/icons-material'
import { useSocket } from '../hooks/useSocket'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ImageEditorDialog } from './ImageEditorDialog'
import { useImageEditor } from '../hooks/useImageEditor'
import { zodResolver } from '@hookform/resolvers/zod'
import { userProfileUpdationFormValidation } from '../schemaValidators/yupFormValidators'
import { axiosServerInstance, queryClient } from '../App'
import { ButtonWithLoader } from './ButtonWithLoader'
import { useAuth } from '../hooks/useAuth'
import { formToJSON } from 'axios'

interface ProfileSettingsDialogProps {
    // userProfile: UserWithoutID
}

export type ProfileFormValues = {
    displayName?: UserWithoutID['displayName']
    status?: UserWithoutID['status']
    avatar?: File
}

export const ProfileSettings = ({ ...props }: ProfileSettingsDialogProps) => {
    const {
        authStatus: { username, userDetails },
    } = useAuth()

    const handleProfileSubmit: SubmitHandler<ProfileFormValues> = async ({ displayName, avatar, status }) => {
        if (!username) throw new Error('username is undefined while user is logged in. Impossible scenario.')

        const fd = new FormData()
        if (avatar) fd.append('upload', avatar)
        if (displayName && displayName !== userDetails?.displayName?.trim()) fd.append('displayName', displayName)
        if (status && status !== userDetails?.status) fd.append('status', status)
        fd.append('username', username)

        const form = formToJSON(fd)

        if (Object.keys(form).length > 1) {
            axiosServerInstance.put(Routes.put.user, fd).then(res => res.data)
        }
    }

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting, isValidating, defaultValues },
        setValue,
    } = useForm({
        resolver: zodResolver(userProfileUpdationFormValidation),
        defaultValues: {
            status: 'available',
            displayName: '',
        } as ProfileFormValues,
        mode: 'onChange',
        reValidateMode: 'onChange',
        criteriaMode: 'firstError',
        shouldUnregister: true,
    })

    const { imageEditroDialogProps, status, handleOpen, editedImageData, setSourceImage, sourceImage } =
        useImageEditor()

    useEffect(() => {
        if (editedImageData?.file && status === 'successful') setValue('avatar', editedImageData.file)
    }, [editedImageData?.file])

    useEffect(() => {
        return () => {
            reset(defaultValues)
        }
    }, [])

    return (
        <>
            {sourceImage ? <ImageEditorDialog {...imageEditroDialogProps} sourceImage={sourceImage} /> : null}

            <List component='form' onSubmit={handleSubmit(handleProfileSubmit)}>
                <StyledListItem>
                    <ListItemText primaryTypographyProps={{ fontWeight: 'bold', variant: 'subtitle1' }}>
                        Avatar :
                    </ListItemText>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <Typography variant='body2' mb={0.8} ml={2}>
                            {editedImageData ? 'Image ready for uplaod' : 'No image selected'}
                        </Typography>
                        <IconButton component={'label'} sx={{ ml: 0 }}>
                            <Avatar
                                sx={() => {
                                    const size = 30
                                    return { width: size, height: size }
                                }}
                                src={editedImageData?.url}
                                children={<CloudUploadRounded />}
                            />
                            <input
                                type='file'
                                accept='image/*'
                                hidden
                                onChange={e => {
                                    const file = e.target.files && e.target.files[0]
                                    if (file) {
                                        setSourceImage(file)
                                        handleOpen()
                                    }
                                }}
                            />
                        </IconButton>
                    </Box>
                </StyledListItem>

                <StyledListItem>
                    <ListItemText primaryTypographyProps={{ fontWeight: 'bold', variant: 'subtitle1' }}>
                        Display Name :
                    </ListItemText>

                    <StyledTextField
                        sx={{ ml: 2 }}
                        {...register('displayName')}
                        placeholder='Enter a name...'
                        error={errors.displayName?.message !== undefined}
                        helperText={errors?.displayName?.message ?? ' '}
                    />
                </StyledListItem>

                <StyledListItem>
                    <ListItemText primaryTypographyProps={{ fontWeight: 'bold', variant: 'subtitle1' }}>
                        Status :
                    </ListItemText>
                    <ToggleButtonGroup
                        exclusive
                        sx={{ ml: 2 }}
                        value={watch('status')}
                        {...register('status')}
                        onChange={(_, value) => setValue('status', value)}
                    >
                        <ToggleButton value={UserStatus.available}>{UserStatus.available}</ToggleButton>
                        <ToggleButton value={UserStatus.dnd}>{UserStatus.dnd}</ToggleButton>
                        <ToggleButton value={UserStatus.hidden}>{UserStatus.hidden}</ToggleButton>
                    </ToggleButtonGroup>
                </StyledListItem>

                <ButtonGroup variant='text' disabled={isSubmitting} fullWidth sx={{ mt: 'auto' }}>
                    <Button onClick={() => reset(defaultValues)}>reset</Button>
                    <ButtonWithLoader
                        showLoader={isSubmitting || isValidating}
                        type='submit'
                        disabled={isSubmitting || isValidating}
                        onClick={() => handleSubmit(handleProfileSubmit)()}
                    >
                        Confirm
                    </ButtonWithLoader>
                </ButtonGroup>
            </List>
        </>
    )
}

const StyledListItem = (props: PropsWithChildren) => {
    return (
        <ListItem sx={{ display: 'grid', gap: 1, pb: 4 }} divider>
            {props.children}
        </ListItem>
    )
}
