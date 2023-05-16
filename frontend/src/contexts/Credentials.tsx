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
    const [credential, setCredentials] = useState<Credentials>({
        username: '',
        isLoggedIn: false,
        accessToken: '',
    })

    const setUserCredentials = (username: string, accessToken: string) => {
        setCredentials({ username, accessToken, isLoggedIn: true })
        updateLocalStorageWithAccessToken(accessToken)
    }
    const setUserUsername = (username: string) => {
        setCredentials(prev => ({ ...prev, username, isLoggedIn: true }))
    }

    const setUserAccessToken = (accessToken: string) => {
        setCredentials(prev => ({ ...prev, accessToken, isLoggedIn: true }))
        updateLocalStorageWithAccessToken(accessToken)
    }

    const updateLocalStorageWithAccessToken = (accessTokenValue: string) => {
        window.localStorage.setItem('accessTokenValue', JSON.stringify(accessTokenValue))
    }

    return (
        <CredentialContext.Provider value={{ ...credential, setUserCredentials, setUserUsername, setUserAccessToken }}>
            {props.children}
        </CredentialContext.Provider>
    )
}
