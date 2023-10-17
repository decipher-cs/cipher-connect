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
import { useForm } from 'react-hook-form'
import { object } from 'yup'
import { useDialog } from '../hooks/useDialog'
import { ImageEditorDialog } from './ImageEditorDialog'
import { useImageEditor } from '../hooks/useImageEditor'
import { yupResolver } from '@hookform/resolvers/yup'
import { userProfileUpdationFormValidation } from '../schemaValidators/yupFormValidators'

interface ProfileSettingsDialogProps {
    readonly dialogOpen: boolean
    handleClose: () => void
    userProfile: UserWithoutID
}

export const ProfileSettingsDialog = ({ handleClose, userProfile, ...props }: ProfileSettingsDialogProps) => {
    const { username } = useContext(CredentialContext)

    const socket = useSocket()

    const { imageEditorProps, editorRef, editedImage, handleOpen, originalImage, setOriginalImage } = useImageEditor()

    const { mutate: mutateProfile, data: updatedProfileData } = useMutation({
        mutationKey: ['updateProfile'],
        mutationFn: (formData: FormData) =>
            axios.post(Routes.put.user, formData, { baseURL: import.meta.env.VITE_SERVER_URL }).then(res => res.data),
    })

    const handleImageUpload = async (newAvatar: File) => {
        if (!newAvatar) return

        const fd = new FormData()

        fd.append('avatar', newAvatar)
        fd.append('username', username)

        // const newPath = mutateAvatar(fd)
    }

    // this needs to be emitted so other users know to update user settings
    // const handleSettingsUpdate = async (values: { displayName: string }) => {
    //     try {
    //         socket.emit('userProfileUpdated', {
    //             ...props.userProfile,
    //             displayName: values.displayName,
    //         })
    //     } catch (err) {
    //         throw new Error('error: ' + err)
    //     }
    // }

    const foobar = () => {
        return
    }

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
        control,
        setValue,
        getValues,
    } = useForm({
        // resolver: yupResolver(userProfileUpdationFormValidation),
        defaultValues: {
            displayName: userProfile.displayName,
            status: userProfile.status,
            avatar: userProfile.avatarPath,
        },
    })

    console.log(watch('displayName'), watch('status'))

    return (
        <>
            <Dialog open={props.dialogOpen} onClose={handleClose} fullWidth>
                <DialogTitle>Profile Settings</DialogTitle>

                {originalImage && <ImageEditorDialog {...imageEditorProps} originalImgSource={originalImage} />}

                <DialogContent>
                    <DialogContentText></DialogContentText>
                    <List component='form' onSubmit={() => handleSubmit(foobar)}>
                        <ListItem>
                            <ListItemText>Avatar</ListItemText>

                            <Avatar src={editedImage} sx={{ mr: 6 }} />

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
                                onChange={(e, value) => {
                                    setValue('status', value)
                                }}
                            >
                                <ToggleButton value={UserStatus.available}>{UserStatus.available}</ToggleButton>
                                <ToggleButton value={UserStatus.dnd}>{UserStatus.dnd}</ToggleButton>
                                <ToggleButton value={UserStatus.hidden}>{UserStatus.hidden}</ToggleButton>
                            </ToggleButtonGroup>
                        </ListItem>
                        <ListItem>{errors.root?.message}</ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <ButtonGroup variant='outlined'>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => reset()}>reset</Button>
                        <Button disabled={isSubmitting}>Confirm</Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    )
}
