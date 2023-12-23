import axios, { InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'

declare module 'axios' {
    interface InternalAxiosRequestConfig {
        retry?: number
        retryDelayInMs?: number
    }
    interface AxiosRequestConfig {
        retry?: number
        retryDelayInMs?: number
    }
}
