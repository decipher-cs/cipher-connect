import React, { createContext, useState } from 'react'

export const CredentialContext = createContext({
    username: '',
    isLoggedIn: false,
    setUserUsername: (username: string) => {},
})

export interface Credentials {
    username: string
    isLoggedIn: boolean
}

export const CredentialContextProvider = (props: React.PropsWithChildren) => {
    const [credential, setCredentials] = useState<Credentials>({
        username: '',
        isLoggedIn: false,
    })

    const setUserUsername = (username: string) => {
        setCredentials(prev => ({ ...prev, username, isLoggedIn: true }))
        window.localStorage.setItem('username', username)
    }

    return (
        <CredentialContext.Provider value={{ ...credential, setUserUsername }}>
            {props.children}
        </CredentialContext.Provider>
    )
}
