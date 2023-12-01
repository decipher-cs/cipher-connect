import React, { createContext, useState } from 'react'

export interface AuthContext {
    authStatus: {
        username: string | undefined
        isLoggedIn: boolean
    }
    resetUserAuth: () => void
    authoriseUser: (username: string) => void
}

export const AuthenticationContext = createContext<AuthContext | null>(null)

export const AuthenticationContextProvider = (props: React.PropsWithChildren) => {
    const [authStatus, setAuthStatus] = useState<AuthContext['authStatus']>({
        username: undefined,
        isLoggedIn: false,
    })

    const resetUserAuth = () => {
        setAuthStatus({ isLoggedIn: false, username: undefined })
    }

    const authoriseUser = (username: string) => {
        if (username) setAuthStatus({ isLoggedIn: true, username })
        else throw new Error('username cannot be undefined while setting auth status')
    }

    return (
        <AuthenticationContext.Provider value={{ authStatus, resetUserAuth, authoriseUser }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}
