import {
    Avatar,
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
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CredentialContext } from '../contexts/Credentials'
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

interface ProfileSettingsDialogProps {
    readonly dialogOpen: boolean
    handleClose: () => void
    userProfile: UserWithoutID
}

export type ProfileFormValues = {
    displayName?: UserWithoutID['displayName']
    status?: UserWithoutID['status']
    avatar?: File
}

export const ProfileSettingsDialog = ({ handleClose, userProfile, ...props }: ProfileSettingsDialogProps) => {
    const { username } = useContext(CredentialContext)

    const socket = useSocket()

    const { mutate: mutateProfile } = useMutation({
        mutationKey: ['userProfile'],
        //TODO:use axios.formToJSON instead of formData
        mutationFn: (formData: FormData) => axiosServerInstance.put(Routes.put.user, formData).then(res => res.data),
        onSuccess: data => {
            queryClient.refetchQueries({ queryKey: ['userProfile'] })
            // TODO: alert other users
            // socket.emit('userProfileUpdated', data)
            handleClose()
        },
    })

    const handleProfileSubmit: SubmitHandler<ProfileFormValues> = ({ displayName, avatar, status }) => {
        const fd = new FormData()
        if (displayName) fd.append('displayName', displayName)
        if (avatar) fd.append('upload', avatar)
        if (status && status !== userProfile.status) fd.append('status', status)

        let formLength = 0
        fd.forEach(_ => formLength++)

        if (formLength > 0) {
            fd.append('username', username)
            mutateProfile(fd)
        }
    }

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(userProfileUpdationFormValidation),
        defaultValues: {
            status: userProfile.status,
        } as ProfileFormValues,
    })

    const { imageEditroDialogProps, status, handleOpen, editedImageData, setSourceImage, sourceImage } =
        useImageEditor()

    useEffect(() => {
        if (editedImageData?.file && status === 'successful') setValue('avatar', editedImageData.file)
    }, [editedImageData?.file])

    useEffect(() => {
        // resets form data when form is closed
        return () => {
            reset()
        }
    }, [])

    return (
        <>
            <Dialog open={props.dialogOpen} onClose={handleClose} fullWidth>
                <DialogTitle>Profile Settings</DialogTitle>

                {sourceImage ? <ImageEditorDialog {...imageEditroDialogProps} sourceImage={sourceImage} /> : null}

                <DialogContent>
                    <List component='form' onSubmit={() => handleSubmit(handleProfileSubmit)}>
                        <ListItem sx={{ gap: 3 }}>
                            <ListItemText>Avatar</ListItemText>

                            <IconButton component={'label'}>
                                <Avatar src={editedImageData?.url} children={<CloudUploadRounded />} />
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
                        </ListItem>

                        <ListItem>
                            <ListItemText>Display Name</ListItemText>
                            <StyledTextField
                                size='small'
                                {...register('displayName')}
                                placeholder={userProfile.displayName}
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemText>Status</ListItemText>
                            <ToggleButtonGroup
                                exclusive
                                size='small'
                                value={watch('status')}
                                {...register('status')}
                                onChange={(_, value) => setValue('status', value)}
                            >
                                <ToggleButton value={UserStatus.available}>{UserStatus.available}</ToggleButton>
                                <ToggleButton value={UserStatus.dnd}>{UserStatus.dnd}</ToggleButton>
                                <ToggleButton value={UserStatus.hidden}>{UserStatus.hidden}</ToggleButton>
                            </ToggleButtonGroup>
                        </ListItem>

                        <ListItem>
                            <Typography color='red' variant='body1'>
                                {errors &&
                                    (errors?.avatar?.message ||
                                        errors?.status?.message ||
                                        errors?.displayName?.message ||
                                        errors?.root?.message)}
                            </Typography>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <ButtonGroup variant='outlined'>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => reset()}>reset</Button>
                        <Button
                            disabled={isSubmitting}
                            type='submit'
                            onClick={() => handleSubmit(handleProfileSubmit)()}
                            variant='contained'
                        >
                            Confirm
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    )
}
