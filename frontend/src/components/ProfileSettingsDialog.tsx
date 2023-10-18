import {
    Avatar,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Input,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import { FormikConfig, useFormik } from 'formik'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { useFetch } from '../hooks/useFetch'
import { User, UserStatus, UserWithoutID } from '../types/prisma.client'
import { Routes } from '../types/routes'
import { SocketWithCustomEvents } from '../types/socket'
import { StyledTextField } from './StyledTextField'
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded'
import { AvatarEditorDialog } from './AvatarEditorDialog'
import AvatarEditor from 'react-avatar-editor'
import { CloudUploadRounded, FaceRounded } from '@mui/icons-material'
import { useSocket } from '../hooks/useSocket'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { object } from 'yup'
import { useDialog } from '../hooks/useDialog'
import { ImageEditorDialog } from './ImageEditorDialog'
import { useImageEditor } from '../hooks/useImageEditor'
import { yupResolver } from '@hookform/resolvers/yup'
import { userProfileUpdationFormValidation } from '../schemaValidators/yupFormValidators'
import { axiosServerInstance } from '../App'

interface ProfileSettingsDialogProps {
    readonly dialogOpen: boolean
    handleClose: () => void
    userProfile: UserWithoutID
}

export type ProfileFormValues = {
    displayName: UserWithoutID['displayName']
    status: UserWithoutID['status']
    avatar: File | Blob | undefined
    // avatar: UserWithoutID['avatarPath']
}

export const ProfileSettingsDialog = ({ handleClose, userProfile, ...props }: ProfileSettingsDialogProps) => {
    const socket = useSocket()

    const { mutate: mutateProfile, data: updatedProfileData } = useMutation({
        mutationKey: ['updateProfile'],
        mutationFn: (formData: FormData) => axiosServerInstance.put(Routes.put.user, formData).then(res => res.data),
        onSuccess: data => {
            // socket.emit('userProfileUpdated', data)
        },
    })

    const handleProfileSubmit: SubmitHandler<ProfileFormValues> = ({ displayName, avatar, status }) => {
        console.log(displayName, avatar, status)

        const fd = new FormData()
        if (displayName) fd.append('displayName', displayName)
        if (avatar) fd.append('avatar', avatar)
        if (status) fd.append('status', status)

        mutateProfile(fd)
        return
    }

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            displayName: userProfile.displayName,
            status: userProfile.status,
            avatar: undefined,
            // avatar: userProfile.avatarPath,
        } as ProfileFormValues,
        // resolver: yupResolver(userProfileUpdationFormValidation),
    })

    const { imageEditorProps, finalImage, handleOpen, originalImage, setOriginalImage } = useImageEditor(finalImage => {
        if (finalImage?.file) setValue('avatar', finalImage?.file)
    })

    // console.log(watch())

    return (
        <>
            <Dialog open={props.dialogOpen} onClose={handleClose} fullWidth>
                <DialogTitle>Profile Settings</DialogTitle>

                {originalImage && <ImageEditorDialog {...imageEditorProps} originalImgSource={originalImage} />}

                <DialogContent>
                    <DialogContentText></DialogContentText>
                    <List component='form' onSubmit={() => handleSubmit(handleProfileSubmit)}>
                        <ListItem>
                            <ListItemText>Avatar</ListItemText>

                            <Avatar src={finalImage?.url} sx={{ mr: 6 }} />

                            <Button
                                variant='outlined'
                                size='small'
                                component={'label'}
                                startIcon={<CloudUploadRounded />}
                            >
                                Upload
                                <input
                                    type='file'
                                    accept='image/*'
                                    hidden
                                    onChange={e => {
                                        const file = e.target.files && e.target.files[0]
                                        if (file) {
                                            setOriginalImage(file)
                                            handleOpen()
                                        }
                                    }}
                                />
                            </Button>
                        </ListItem>

                        <ListItem>
                            <ListItemText>Display Name</ListItemText>
                            <StyledTextField size='small' {...register('displayName')} />
                        </ListItem>

                        <ListItem>
                            <ListItemText>Status</ListItemText>
                            <ToggleButtonGroup
                                exclusive
                                size='small'
                                value={watch('status')}
                                {...register('status')}
                                onChange={(e, value) => {
                                    setValue('status', value)
                                }}
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
                        >
                            Confirm
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    )
}
