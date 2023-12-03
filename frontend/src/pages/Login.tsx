import { Box, Button, CircularProgress, Container, Tab, Tabs } from '@mui/material'
import { useContext, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { StyledTextField } from '../components/StyledTextField'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginAndSignupValidation } from '../schemaValidators/yupFormValidators'
import { z } from 'zod'
import { axiosServerInstance } from '../App'
import axios, { AxiosError } from 'axios'
import { ButtonWithLoader } from '../components/ButtonWithLoader'
import { useAuth } from '../hooks/useAuth'

export const Login = () => {
    const {
        authStatus: { isLoggedIn, username },
        authoriseUser,
    } = useAuth()

    const navigate = useNavigate()

    const [isLogin, setIsLogin] = useState(true)

    const formType = isLogin ? 'login' : 'signup'

    const selectedTab = isLogin === true ? 0 : 1

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, isLoading },
    } = useForm<z.infer<typeof loginAndSignupValidation>>({
        defaultValues: {
            username: import.meta.env.DEV === true ? 'password' : '',
            password: import.meta.env.DEV === true ? 'password' : '',
        },
        resolver: zodResolver(loginAndSignupValidation),
    })

    const handleUserLogin: SubmitHandler<z.infer<typeof loginAndSignupValidation>> = async ({ username, password }) => {
        try {
            const response = await axiosServerInstance.post(formType, { username, password })

            if (response.status === 200) {
                authoriseUser(username)
                navigate('/chat')
            }
        } catch (error) {
            if (error instanceof AxiosError && error?.response?.status === 401) {
                setError('root', { message: 'Invalid username or password' })
            } else setError('root', { message: 'Unknown Error' })
        }
    }

    if (isLoggedIn === true) {
        return <Navigate to='/chat' replace />
    }

    return (
        <Box
            sx={{
                background: theme => theme.design.background,
                backgroundSize: theme => (theme.palette.mode === 'dark' ? theme.design.backgroundSize : null),
                height: '100svh',
            }}
        >
            <Tabs value={selectedTab} onChange={() => setIsLogin(!isLogin)} centered>
                <Tab label='Login' />
                <Tab label='Signup' />
            </Tabs>
            {Array(2)
                .fill('')
                .map((_, i) => {
                    return (
                        <div key={i}>
                            {selectedTab === i ? (
                                <Container
                                    component='form'
                                    role='tabpanel'
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        placeItems: 'center',
                                        gap: 2,
                                        marginTop: 4,
                                    }}
                                    maxWidth='sm'
                                    onSubmit={handleSubmit(handleUserLogin)}
                                >
                                    <StyledTextField
                                        label='username'
                                        fullWidth
                                        error={errors.username !== undefined}
                                        helperText={errors?.username?.message ?? ''}
                                        {...register('username')}
                                    />
                                    <StyledTextField
                                        label='password'
                                        fullWidth
                                        error={errors.password !== undefined}
                                        helperText={errors?.password?.message ?? ''}
                                        type='password'
                                        {...register('password')}
                                    />

                                    {errors.root?.message ? (
                                        <Box color={theme => theme.palette.error.main}>{errors.root.message}</Box>
                                    ) : (
                                        <br />
                                    )}

                                    <Box display='inline-flex' gap={3}>
                                        <Button
                                            type='reset'
                                            variant='contained'
                                            onClick={() => reset()}
                                            disabled={isSubmitting}
                                        >
                                            reset
                                        </Button>
                                        <ButtonWithLoader
                                            showLoader={isSubmitting || isLoading}
                                            type='submit'
                                            variant='contained'
                                            disabled={isSubmitting || isLoading}
                                        >
                                            submit
                                        </ButtonWithLoader>
                                    </Box>
                                </Container>
                            ) : null}
                        </div>
                    )
                })}
        </Box>
    )
}
