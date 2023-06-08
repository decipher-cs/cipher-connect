import React, { createContext, useState } from 'react'

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]

type CredentialKey = RequireAtLeastOne<Credentials>

export const CredentialContext = createContext({
    username: '',
    sessionId: '',
    isLoggedIn: false,
    handleCredentialChange: (newCredential: CredentialKey) => {},
    logUserOut: () => {},
})

export interface Credentials {
    username: string
    sessionId: string
    isLoggedIn: boolean
}

export const CredentialContextProvider = (props: React.PropsWithChildren) => {
    const [credential, setCredentials] = useState<Credentials>({
        username: '',
        sessionId: '',
        isLoggedIn: false,
    })

    const handleCredentialChange = (newCredential: CredentialKey) => {
        setCredentials(prev => ({ ...prev, ...newCredential }))
        if (newCredential?.username !== undefined) window.localStorage.setItem('username', newCredential.username)
    }

    const logUserOut = () => {
        setCredentials({ isLoggedIn: false, username: '', sessionId: '' })
    }

    return (
        <CredentialContext.Provider value={{ ...credential, handleCredentialChange, logUserOut }}>
            {props.children}
        </CredentialContext.Provider>
    )
}
