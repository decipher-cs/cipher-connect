import { Tab, Tabs, TextField, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { TabPanel } from '../components/TabPanel'
import { useFormik } from 'formik'
import { CredentialContext } from '../contexts/Credentials'
import { Navigate, useNavigate } from 'react-router-dom'
import { StyledTextField } from '../components/StyledTextField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginAndSignupValidation } from '../schemaValidators/yupFormValidators'
import { z } from 'zod'
import { axiosServerInstance } from '../App'

export const Login = () => {
    const { isLoggedIn, handleCredentialChange } = useContext(CredentialContext)

    const navigate = useNavigate()

    const [isLogin, setIsLogin] = useState(true)

    const formType = isLogin ? 'login' : 'signup'

    const selectedTab = isLogin === true ? 0 : 1

    const handleUserLogin = async (values: { username: string; password: string }) => {
        const username = values.username
        const password = values.password

        const response = await axiosServerInstance.post(formType, { username, password })

        if (response.status === 200) {
            handleCredentialChange({ username, isLoggedIn: true })
            navigate('/chat')
        }
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof loginAndSignupValidation>>({
        resolver: zodResolver(loginAndSignupValidation),
        defaultValues: {
            username: import.meta.env.DEV === true ? 'password' : '',
            password: import.meta.env.DEV === true ? 'password' : '',
        },
    })

    if (isLoggedIn === true) {
        return <Navigate to='/chat' replace />
    }

    return (
        <>
            <Tabs value={selectedTab} onChange={() => setIsLogin(!isLogin)} centered>
                <Tab label='Login' />
                <Tab label='Signup' />
            </Tabs>
            {Array(2)
                .fill('')
                .map((_, i) => {
                    return (
                        <TabPanel
                            key={i}
                            value={selectedTab}
                            index={i}
                            handleSubmit={handleSubmit(handleUserLogin)}
                            handleFormReset={() => reset()}
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
                                {...register('password')}
                            />
                        </TabPanel>
                    )
                })}
        </>
    )
}
