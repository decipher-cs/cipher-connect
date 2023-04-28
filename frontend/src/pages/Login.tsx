import { Fingerprint } from '@mui/icons-material'
import { Container, IconButton, Tab, Tabs, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

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
                    sx={{ display: 'flex', flexDirection: 'column', placeItems: 'center', gap: 2 }}
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
    const [currTab, setCurrTab] = useState<0 | 1>(0)

    const handleTabChange = (_: React.SyntheticEvent, newTabValue: 0 | 1) => setCurrTab(newTabValue)

    const [fieldValue, setFieldValue] = useState('sample@sample.com')

    const [password, setPassword] = useState('123')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFieldValue(e.target.value)
    }

    const handleChangeOnPassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const URL = import.meta.env.PROD ? import.meta.env.VITE_SERVER_PROD_URL : import.meta.env.VITE_SERVER_DEV_URL
        console.log('submited')
        const userDetails = { name: fieldValue, password }
        setInterval(async () => {
            let response = await fetch(`${URL}/login`, {
                body: JSON.stringify({ username: userDetails.name, password }),
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            let data = await response.text()
            console.log(data)
        }, 1000 * 10)
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
                    value={fieldValue}
                    onChange={handleChange}
                    onSubmit={e => e.preventDefault()}
                    helperText='Must be unique? idk'
                    required
                    type={'email'}
                />
                <TextField
                    label='password'
                    value={password}
                    onChange={handleChangeOnPassword}
                    onSubmit={e => e.preventDefault()}
                    helperText='Passwords are hased'
                    required
                    type={'password'}
                />
                <IconButton type='submit'>
                    <Fingerprint />
                </IconButton>
            </TabPanel>

            <TabPanel value={currTab} index={1} handleSubmit={handleSubmit}>
                <TextField
                    label='name/ email'
                    value={fieldValue}
                    onChange={handleChange}
                    onSubmit={e => e.preventDefault()}
                    helperText='Must be unique? idk'
                    required
                    type={'email'}
                />
                <TextField
                    label='password'
                    value={password}
                    onChange={handleChangeOnPassword}
                    onSubmit={e => e.preventDefault()}
                    helperText='Passwords are hased'
                    required
                    type={'password'}
                />
                <IconButton type='submit'>
                    <Fingerprint />
                </IconButton>
            </TabPanel>
        </>
    )
}
