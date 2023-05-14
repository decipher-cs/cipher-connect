import React, { createContext, useState } from 'react'

export const CredentialContext = createContext({
    username: '',
    isLoggedIn: false,
    accessToken: '',
    setUserCredentials: (username: string, accessToken: string) => {},
    setUserUsername: (username: string) => {},
    setUserAccessToken: (accessToken: string) => {},
})

export const CredentialContextProvider = (props: React.PropsWithChildren) => {
    const [credential, setCredentials] = useState({
        username: '',
        isLoggedIn: false,
        accessToken: '',
    })

    const setUserCredentials = (username: string, accessToken: string) => {
        setCredentials({ username, accessToken, isLoggedIn: true })
    }
    const setUserUsername = (username: string) => {
        setCredentials(prev => ({ ...prev, username, isLoggedIn: true }))
    }

    const setUserAccessToken = (accessToken: string) => {
        setCredentials(prev => ({ ...prev, accessToken, isLoggedIn: true }))
    }

    return (
        <CredentialContext.Provider value={{ ...credential, setUserCredentials, setUserUsername, setUserAccessToken }}>
            {props.children}
        </CredentialContext.Provider>
    )
}
