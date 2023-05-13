import { ArrowForward, Fingerprint } from '@mui/icons-material'
import { Button, Container, IconButton, Tab, Tabs, TextField } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import { TabPanel } from '../components/TabPanel'
import { CredentialContext } from '../contexts/Credentials'

// const CustomTextField = (props: { value: string; handleChange; helperText }) => {
//     return (
//         <TextField
//             label='name/ email'
//             value={username}
//             onChange={handleChange}
//             error={usernameError}
//             helperText={usernameHelperText}
//             onBlur={() => setUsername(prev => prev.trim())}
//             required
//             onSubmit={e => e.preventDefault()}
//             size='small'
//         />
//     )
// }

export const Login = () => {
    const { isLoggedIn, username: currUsername, handleCredentialChange } = useContext(CredentialContext)

    const [currTab, setCurrTab] = useState<0 | 1>(0) // 0 is login and 1 is signup

    const authMode = useRef<'login' | 'signup'>('login')

    const [usernameHelperText, setUsernameHelperText] = useState('Username must be unique')

    const [passwordHelperText, setPasswordHelperText] = useState('Enter a strong password')

    const [usernameError, setUsernameError] = useState(false)

    const [passwordError, setPasswordError] = useState(false)

    const [username, setUsername] = useState('password')

    const [password, setPassword] = useState('password')

    const handleTabChange = (_: React.SyntheticEvent, newTabValue: 0 | 1) => {
        setCurrTab(newTabValue)
        setUsernameError(false)
        setPasswordError(false)
        authMode.current = newTabValue === 0 ? 'login' : 'signup'
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUsername(e.target.value)
        setUsernameError(false)
    }

    const handleChangeOnPassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(e.target.value)
        setPasswordError(false)
    }

    const isUsernameValid = () => {
        // Checks if string has characters other than alphabet, numbers, and some special characters
        const onlyAlphanumericAndSpecialRegex = /[^\w!@#$%^&*]/

        if (RegExp(onlyAlphanumericAndSpecialRegex).test(username) === true) {
            setUsernameError(true)
            setUsernameHelperText('username can only contain alphanumeric and !@#$%^&*')
            return false
        } else if (username.length > 16 || username.length < 3) {
            setUsernameError(true)
            setUsernameHelperText('Username length must be between 3 and 16 characters')
            return false
        }
        return true
    }

    const isPasswordValid = () => {
        // Checks if string has characters other than alphabet, numbers, and some special characters
        const onlyAlphanumericAndSpecialRegex = /[^\w!@#$%^&*]/

        if (RegExp(onlyAlphanumericAndSpecialRegex).test(password) === true) {
            setPasswordError(true)
            setPasswordHelperText('Password can only contain alphanumeric and !@#$%^&*')
            return false
        } else if (password.length > 50 || password.length < 8) {
            setPasswordError(true)
            setPasswordHelperText('Password length must be between 10 and 50 characters')
            return false
        }
        return true
    }

    const handleFetchResponse = (statusCode: number) => {
        switch (statusCode) {
            case 200:
                //
                break

            default:
                break
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (isUsernameValid() === false || isPasswordValid() === false) return false

        const URL = import.meta.env.PROD ? import.meta.env.VITE_SERVER_PROD_URL : import.meta.env.VITE_SERVER_DEV_URL

        const response = await fetch(`${URL}/${authMode.current}`, {
            body: JSON.stringify({ username, password }),
            method: 'POST',
            // credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        if (response.status === 409) {
            setUsernameError(true)
            setUsernameHelperText('Username taken')
        } else if (response.status === 200) {
            handleCredentialChange(username)
        }

        console.log(await response.text())
    }

    return (
        <>
            <Tabs value={currTab} onChange={handleTabChange} centered>
                <Tab label='Login' />
                <Tab label='Signup' />
            </Tabs>

            <TabPanel value={currTab} index={0} handleSubmit={handleSubmit}>
                <TextField
                    label='name/ email'
                    value={username}
                    onChange={handleChange}
                    error={usernameError}
                    helperText={usernameHelperText}
                    onBlur={() => setUsername(prev => prev.trim())}
                    required
                    onSubmit={e => e.preventDefault()}
                    size='small'
                />
                <TextField
                    label='password'
                    value={password}
                    onChange={handleChangeOnPassword}
                    helperText={passwordHelperText}
                    error={passwordError}
                    type={'password'}
                    required
                    onSubmit={e => e.preventDefault()}
                    size='small'
                />
                <Button type='submit' endIcon={<ArrowForward />}>
                    login
                </Button>
            </TabPanel>

            <TabPanel value={currTab} index={1} handleSubmit={handleSubmit}>
                <TextField
                    label='name/ email'
                    value={username}
                    onChange={handleChange}
                    onSubmit={e => e.preventDefault()}
                    helperText={usernameHelperText}
                    onBlur={() => setUsername(prev => prev.trim())}
                    size='small'
                    required
                    error={usernameError}
                />
                <TextField
                    label='password'
                    value={password}
                    onChange={handleChangeOnPassword}
                    onSubmit={e => e.preventDefault()}
                    helperText={passwordHelperText}
                    error={passwordError}
                    required
                    size='small'
                    type={'password'}
                />
                <Button type='submit' endIcon={<ArrowForward />}>
                    signup
                </Button>
            </TabPanel>
        </>
    )
}
