import { useEffect, useState } from 'react'

export const useFetch = <T>(
    route: string,
    triggerFetchManually = false,
    params?: string,
    body?: object,
    onSuccess?: (data: T) => void,
    method?: RequestInit['method']
) => {
    const [data, setData] = useState<T>()

    const [error, setError] = useState<any>(null)

    const [fetchStatus, setFetchStatus] = useState<'loading' | 'finished' | 'not-started'>('not-started')

    const abortController = new AbortController()

    const URL =
        params === undefined || params === null
            ? import.meta.env.VITE_SERVER_URL + route
            : import.meta.env.VITE_SERVER_URL + route + '/' + params

    const startFetching = async (config?: RequestInit, localParams?: string[]) => {
        try {
            setFetchStatus('loading')

            const defaultConfig: RequestInit = {
                method: method ?? (config?.method ?? body === undefined ? 'GET' : 'POST'),
                body: body === undefined ? body : JSON.stringify(body),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                signal: abortController.signal,
                ...config,
            }

            const configURL =
                localParams === undefined || localParams === null ? URL : URL + ('/' + localParams.join('/'))

            console.log('fetch started', configURL)
            const response = await fetch(configURL, defaultConfig)
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
            } else if (contentType.includes('text/plain')) {
                data = (await response.text()) as T
            } else if (contentType.includes('text/html')) {
                data = (await response.text()) as T
            } else {
                throw new Error(
                    'Unsupported "Content-Type" in response. See custrom hook useFetch. Got "' + contentType + '"'
                )
            }

            if (onSuccess) onSuccess(data)

            setData(data)
            return data
        } catch (error) {
            setError(error)
            throw new Error('caught: ' + error)
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
