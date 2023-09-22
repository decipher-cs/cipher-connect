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
    Typography,
} from '@mui/material'
import { FormikConfig, useFormik } from 'formik'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CredentialContext } from '../contexts/Credentials'
import { useFetch } from '../hooks/useFetch'
import { User } from '../types/prisma.client'
import { Routes } from '../types/routes'
import { SocketWithCustomEvents } from '../types/socket'
import { StyledTextField } from './StyledTextField'
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded'
import { AvatarEditorDialog } from './AvatarEditorDialog'
import AvatarEditor from 'react-avatar-editor'
import { CloudUploadRounded, FaceRounded } from '@mui/icons-material'

interface ProfileSettingsDialogProps {
    readonly dialogOpen: boolean
    readonly socketObject: SocketWithCustomEvents
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    setUserProfile: React.Dispatch<React.SetStateAction<User>>
    userProfile: User
}

const validate = (values: { displayName: string }) => {
    const { displayName } = values
    const errors: { [key: string]: null | string } = { displayName: null }
    const MIN_LEN = 3
    const MAX_LEN = 16

    if (!displayName || displayName.length < 3 || displayName.length > 16)
        errors.displayName = `Name length can only be between ${MIN_LEN} and ${MAX_LEN} characters.`
    return errors
}

export const ProfileSettingsDialog = (props: ProfileSettingsDialogProps) => {
    const { username } = useContext(CredentialContext)

    const handleClose = () => props.setDialogOpen(false)

    const { startFetching: uploadAvater } = useFetch<string>(Routes.post.avatar, true)

    const [selectedImage, setSelectedImage] = useState<File>()

    const [openAvatarEditor, setOpenAvatarEditor] = useState(false)

    const handleAvatarEditorToggle = () => setOpenAvatarEditor(p => !p)

    const handleImageUpload = async () => {
        const file = selectedImage
        if (!file) return

        const fd = new FormData()

        fd.append('avatar', file)
        fd.append('username', username)

        const newPath = await uploadAvater({ body: fd, method: 'POST' })

        setSelectedImage(undefined)

        props.socketObject.emit('userProfileUpdated', { ...props.userProfile, avatarPath: newPath })

        props.setUserProfile(p => ({ ...p, avatarPath: newPath }))
    }

    const handleSettingsUpdate = async (values: { displayName: string }) => {
        try {
            props.socketObject.emit('userProfileUpdated', {
                ...props.userProfile,
                displayName: values.displayName,
            })
        } catch (err) {
            throw new Error('error: ' + err)
        }
    }

    const formikProfileSettings = useFormik({
        initialValues: { displayName: '' },
        validate,
        onSubmit: handleSettingsUpdate,
    })

    const ref = useRef<AvatarEditor>(null)

    ref.current?.getImage().toBlob(blob => {
        if (blob) {
            const file = new File([blob], 'avatar', { type: blob.type })
            setSelectedImage(file)
        }
    })

    return (
        <>
            <Dialog open={props.dialogOpen} onClose={handleClose} fullWidth>
                <DialogTitle>Profile Settings</DialogTitle>

                {selectedImage !== undefined ? (
                    <AvatarEditorDialog
                        imgSrc={selectedImage}
                        handleClose={handleAvatarEditorToggle}
                        open={openAvatarEditor}
                        editorRef={ref}
                    />
                ) : null}

                <DialogContent>
                    <DialogContentText>
                        {/* TODO: set color='red' to color = theme.pallete.main.error*/}
                        <Typography color='red'>
                            {formikProfileSettings.touched.displayName && formikProfileSettings.errors.displayName}
                        </Typography>
                    </DialogContentText>
                    <List
                        // disablePadding
                        id='profile-settings'
                        component='form'
                        onSubmit={formikProfileSettings.handleSubmit}
                    >
                        <ListItem>
                            <ListItemText>Change Picture</ListItemText>

                            <Button variant='outlined' component={'label'} startIcon={<FaceRounded />}>
                                select
                                <input
                                    type='file'
                                    accept='image/*'
                                    hidden
                                    onChange={e => {
                                        const file = e.target.files && e.target.files[0]
                                        if (file) {
                                            setSelectedImage(file)
                                            handleAvatarEditorToggle()
                                        }
                                    }}
                                />
                            </Button>
                            <Button
                                onClick={handleImageUpload}
                                variant='outlined'
                                sx={{ ml: 1 }}
                                disabled={selectedImage === undefined}
                                startIcon={<CloudUploadRounded />}
                            >
                                Upload
                            </Button>
                        </ListItem>
                        <ListItem>
                            <ListItemText>Change Name</ListItemText>
                            <StyledTextField
                                sx={{ width: '40%' }}
                                size='small'
                                placeholder='New Name'
                                error={
                                    formikProfileSettings.touched.displayName &&
                                    formikProfileSettings.errors.displayName !== undefined
                                }
                                // helperText={
                                //     formikProfileSettings.touched.displayName &&
                                //     formikProfileSettings.errors.displayName
                                // }
                                {...formikProfileSettings.getFieldProps('displayName')}
                            />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>
                        Close Settings
                    </Button>
                    <Button variant='contained'>Update Settings </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
