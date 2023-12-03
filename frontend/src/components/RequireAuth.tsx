import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { axiosServerInstance } from '../App'
import { useAuth } from '../hooks/useAuth'

export const RequireAuth = (props: React.PropsWithChildren) => {
    const navigateTo = useNavigate()
    const {
        authStatus: { isLoggedIn },
        resetUserAuth,
    } = useAuth()

    useEffect(() => {
        const intercepter = axiosServerInstance.interceptors.response.use(undefined, interceptedError => {
            if (interceptedError instanceof AxiosError) {
                const { response } = interceptedError
                if (response?.status === 401) {
                    resetUserAuth()
                    navigateTo('/login')
                }
            }
            return Promise.reject(interceptedError)
        })

        return () => {
            axiosServerInstance.interceptors.response.eject(intercepter)
        }
    }, [axiosServerInstance])

    // return <div>please log in</div>
    if (isLoggedIn === true) {
        return <>{props.children}</>
    }

    // TODO
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to='/login' replace />
}
