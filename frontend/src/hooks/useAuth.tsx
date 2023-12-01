import { useContext } from 'react'
import { AuthenticationContext, AuthContext } from '../contexts/AuthenticationContext'

export const useAuth = () => {
    const authContext = useContext(AuthenticationContext)

    if (!authContext) throw new Error('Cannot use context out of provider')

    const { authStatus, authoriseUser, resetUserAuth } = authContext

    return { authStatus, resetUserAuth, authoriseUser }
}
