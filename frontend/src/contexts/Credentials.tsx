import React, { createContext, useState } from 'react'

export const CredentialContext = createContext({
    username: '',
    isLoggedIn: false,
    accessToken: '',
    setUserCredentials: (username: string, accessToken: string) => {},
    setUserUsername: (username: string) => {},
    setUserAccessToken: (accessToken: string) => {},
})

export interface Credentials {
    username: string
    isLoggedIn: boolean
    accessToken: string
}

export const CredentialContextProvider = (props: React.PropsWithChildren) => {
    const storedCredentials = window.localStorage.getItem('credentials')
    console.log('valueare:',storedCredentials)

    let restoredCredentials = {
        username: '',
        isLoggedIn: false,
        accessToken: '',
    }

    if (typeof storedCredentials === 'string') restoredCredentials = JSON.parse(storedCredentials)

    const [credential, setCredentials] = useState<Credentials>(restoredCredentials)

    const setUserCredentials = (username: string, accessToken: string) => {
        setCredentials({ username, accessToken, isLoggedIn: true })
        updateLocalStorage()
    }
    const setUserUsername = (username: string) => {
        setCredentials(prev => ({ ...prev, username, isLoggedIn: true }))
        updateLocalStorage()
    }

    const setUserAccessToken = (accessToken: string) => {
        setCredentials(prev => ({ ...prev, accessToken, isLoggedIn: true }))
        updateLocalStorage()
    }

    const updateLocalStorage = () => {
        window.localStorage.setItem('credentials', JSON.stringify(credential))
        console.log('setting items as', credential)
    }

    return (
        <CredentialContext.Provider value={{ ...credential, setUserCredentials, setUserUsername, setUserAccessToken }}>
            {props.children}
        </CredentialContext.Provider>
    )
}
