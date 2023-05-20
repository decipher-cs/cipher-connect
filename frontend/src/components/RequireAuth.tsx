import { useContext } from 'react'
import { Navigate, redirect } from 'react-router-dom'
import { CredentialContext } from '../contexts/Credentials'

export const RequireAuth = (props: React.PropsWithChildren) => {
    const { username, setUserUsername, isLoggedIn } = useContext(CredentialContext)

    if (isLoggedIn === true) {
        return <>{props.children}</>
    }
    // TODO
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to='/login' replace/>
}
