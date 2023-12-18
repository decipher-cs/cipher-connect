import axios, { InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'

declare module 'axios' {
    interface InternalAxiosRequestConfig {
        retry?: number
    }
    interface AxiosRequestConfig {
        retry?: number
    }
}
