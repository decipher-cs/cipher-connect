import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { axiosServerInstance } from '../App'
import { useAuth } from '../hooks/useAuth'

export const RequireAuth = (props: React.PropsWithChildren) => {
    const {
        authStatus: { isLoggedIn },
        resetUserAuth,
    } = useAuth()

    // useEffect(() => {
        // const intercepter = axiosServerInstance.interceptors.response.use(undefined, interceptedError => {
        //     if (interceptedError instanceof AxiosError) {
        //         const { response } = interceptedError
        //         if (response?.status === 401) resetUserAuth()
        //     }
        //     return Promise.reject(interceptedError)
        // })
        //
        // return () => {
        //     axiosServerInstance.interceptors.response.eject(intercepter)
        // }
    // }, [axiosServerInstance])

    return <> {isLoggedIn === true ? <>{props.children}</> : <Navigate to='/login' replace />} </>

    // TODO
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
}
