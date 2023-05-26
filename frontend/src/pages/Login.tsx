import { Tab, Tabs, TextField } from '@mui/material'
import { useContext, useState } from 'react'
import { TabPanel } from '../components/TabPanel'
import { useFormik } from 'formik'
import { CredentialContext } from '../contexts/Credentials'
import { Navigate, useNavigate } from 'react-router-dom'

const validate = (values: { username: string; password: string }) => {
    const errors: any = {}

    const onlyAlphanumericAndSpecialRegex = /[^\w!@#$%^&*]/

    if (RegExp(onlyAlphanumericAndSpecialRegex).test(values.username) === true) {
        errors.username = 'username can only contain alphanumeric and !@#$%^&*'
    } else if (values.username.length > 16 || values.username.length < 3) {
        errors.username = 'Username length must be between 3 and 16 characters'
    }

    if (RegExp(onlyAlphanumericAndSpecialRegex).test(values.password) === true) {
        errors.password = 'Password can only contain alphanumeric and !@#$%^&*'
    } else if (values.password.length > 50 || values.password.length < 8) {
        errors.password = 'Password length must be between 10 and 50 characters'
    }

    return errors
}

export const Login = () => {
    const { isLoggedIn, handleCredentialChange } = useContext(CredentialContext)

    const navigate = useNavigate()

    const [isLogin, setIsLogin] = useState(true)

    const formType = isLogin ? 'login' : 'signup'

    const selectedTab = isLogin === true ? 0 : 1

    const formik = useFormik({
        initialValues: {
            username: import.meta.env.DEV === true ? 'password' : '',
            password: import.meta.env.DEV === true ? 'password' : '',
        },
        validate,
        onSubmit: async values => {
            const username = values.username
            const password = values.password

            const URL = import.meta.env.PROD
                ? import.meta.env.VITE_SERVER_PROD_URL
                : import.meta.env.VITE_SERVER_DEV_URL

            const response = await fetch(`${URL}/${formType}`, {
                body: JSON.stringify({ username, password }),
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            const responseType = response.statusText
            console.log(responseType)
            switch (responseType) {
                case 'OK':
                    handleCredentialChange({ username, isLoggedIn: true })
                    navigate('/chat')
                    break

                default:
                    break
            }
        },
    })

    if (isLoggedIn === true) {
        return <Navigate to='/chat' />
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
                            handleSubmit={formik.handleSubmit}
                            handleFormReset={formik.handleReset}
                        >
                            <TextField
                                label='username'
                                fullWidth
                                error={formik.errors.username !== undefined && formik.touched.username}
                                helperText={formik.touched.username && formik.errors.username}
                                {...formik.getFieldProps('username')}
                            />
                            <TextField
                                label='password'
                                fullWidth
                                helperText={formik.touched.password && formik.errors.password}
                                error={formik.errors.password !== undefined && formik.touched.password}
                                {...formik.getFieldProps('password')}
                            />
                        </TabPanel>
                    )
                })}
        </>
    )
}
