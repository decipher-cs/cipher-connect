import React, { createContext, useState } from 'react'

export const CredentialContext = createContext({
    username: '',
    isLoggedIn: false,
    handleCredentialChange: (username: string) => {},
})

export const CredentialContextProvider = (props: React.PropsWithChildren) => {
    const [credential, setCredentials] = useState({
        username: '',
        isLoggedIn: false,
    })

    const handleCredentialChange = (username: string) => {
        setCredentials({ username, isLoggedIn: true })
    }

    return (
        <CredentialContext.Provider value={{ ...credential, handleCredentialChange }}>
            {props.children}
        </CredentialContext.Provider>
    )
}
