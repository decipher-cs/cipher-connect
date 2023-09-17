import { useEffect, useState } from 'react'

export const useFetch = <T>(route: string, triggerFetchManually?: boolean) => {
    triggerFetchManually = triggerFetchManually === true

    const [data, setData] = useState<T>()

    const [error, setError] = useState<any>(null)

    const [fetchStatus, setFetchStatus] = useState<'loading' | 'finished' | 'not-started'>('not-started')

    const abortController = new AbortController()

    const baseURL = import.meta.env.VITE_SERVER_URL

    const startFetching = async (config?: RequestInit) => {
        try {
            setFetchStatus('loading')
            const response = await fetch(baseURL + route, {
                method: config?.method ?? 'GET',
                signal: abortController.signal,
                ...config,
            })
            if (response.ok === false) {
                setError(response.statusText)
                throw new Error(response.statusText)
            }
            const contentType = response.headers.get('Content-Type')

            if (contentType === null) {
                setError('Property "Content-Type" not set in the response.')
                throw new Error('Property "Content-Type" not set in the response.')
            }
            let data

            if (contentType.includes('application/json')) {
                data = (await response.json()) as T
            } else if (contentType.includes('application/octet-stream')) {
                data = (await response.blob()) as T
            } else if (contentType.includes('plain/text')) {
                data = (await response.text()) as T
            } else {
                throw new Error('Unsupported "Content-Type" in response. See custrom hook useFetch.')
            }
            console.log(data)
            setData(data)
            return data
        } catch (error) {
            setError(error)
            throw error
        } finally {
            setFetchStatus('finished')
        }
    }

    useEffect(() => {
        if (triggerFetchManually === false) startFetching()

        return () => {
            if (import.meta.env.PROD) abortController.abort()
        }
    }, [])

    return { data, error, startFetching, fetchStatus }
}
