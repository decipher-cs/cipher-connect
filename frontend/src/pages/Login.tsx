import { Fingerprint } from '@mui/icons-material'
import { Container, IconButton, Tab, Tabs, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
    handleSubmit: (e: React.FormEvent) => void
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, handleSubmit, ...other } = props

    return (
        <>
            {value === index && (
                <Container
                    component='form'
                    role='tabpanel'
                    hidden={value !== index}
                    sx={{ display: 'flex', flexDirection: 'column', placeItems: 'center', gap: 2, marginTop: 4 }}
                    maxWidth='sm'
                    onSubmit={handleSubmit}
                    {...other}
                >
                    {children}
                </Container>
            )}
        </>
    )
}

export const Login = () => {
    const [currTab, setCurrTab] = useState<0 | 1>(0) // 0 is login and 1 is signup

    const authMode = useRef<'login' | 'signup'>('login')

    const [usernameHelperText, setUsernameHelperText] = useState('Username must be unique')

    const [passwordHelperText, setPasswordHelperText] = useState('Enter a strong password')

    const [usernameError, setUsernameError] = useState(false)

    const [passwordError, setPasswordError] = useState(false)

    const [username, setUsername] = useState('a')

    const [password, setPassword] = useState('123')

    const handleTabChange = (_: React.SyntheticEvent, newTabValue: 0 | 1) => {
        setCurrTab(newTabValue)
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
        } else if (username.length > 16 || password.length < 3) {
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
        } else if (password.length > 50 || password.length < 10) {
            setPasswordError(true)
            setPasswordHelperText('Password length must be between 10 and 50 characters')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (isUsernameValid() === false || isPasswordValid() === false) return false

        const URL = import.meta.env.PROD ? import.meta.env.VITE_SERVER_PROD_URL : import.meta.env.VITE_SERVER_DEV_URL

        const response = await fetch(`${URL}/${authMode.current}`, {
            body: JSON.stringify({ username, password }),
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        let data = await response.text()
        console.log(data)
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
                    onSubmit={e => e.preventDefault()}
                    error={usernameError}
                    helperText={usernameHelperText}
                    onBlur={() => setUsername(prev => prev.trim())}
                    required
                    size='small'
                />
                <TextField
                    label='password'
                    value={password}
                    onChange={handleChangeOnPassword}
                    onSubmit={e => e.preventDefault()}
                    helperText={passwordHelperText}
                    required
                    size='small'
                    error={passwordError}
                    type={'password'}
                />
                <IconButton type='submit'>
                    <Fingerprint />
                </IconButton>
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
                <IconButton type='submit'>
                    <Fingerprint />
                </IconButton>
            </TabPanel>
        </>
    )
}
