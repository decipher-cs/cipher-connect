import React, { createContext, useState } from 'react'
import { User } from '../types/prisma.client'

export interface AuthContext {
    authStatus:
        | {
              username: undefined
              isLoggedIn: false
              userDetails: undefined
          }
        | {
              username: string
              isLoggedIn: true
              userDetails: User
          }
    resetUserAuth: () => void
    authoriseUser: (username: string, userDetails: User) => void
}

export const AuthenticationContext = createContext<AuthContext | null>(null)

export const AuthenticationContextProvider = (props: React.PropsWithChildren) => {
    const [authStatus, setAuthStatus] = useState<AuthContext['authStatus']>({
        username: undefined,
        isLoggedIn: false,
        userDetails: undefined,
    })

    const resetUserAuth = () => {
        setAuthStatus({ isLoggedIn: false, username: undefined, userDetails: undefined })
    }

    const authoriseUser = (username: string, userDetails: User) => {
        if (username && typeof username === 'string') setAuthStatus({ isLoggedIn: true, username, userDetails })
        else throw new Error('username cannot be undefined while setting auth status')
    }

    return (
        <AuthenticationContext.Provider value={{ authStatus, resetUserAuth, authoriseUser }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}
