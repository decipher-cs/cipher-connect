/// <reference types="vite/client" />
import { Flags, InferType } from 'yup'

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_SERVER_URL: string
    readonly VITE_MEDIA_STORAGE_URL: string
    readonly VITE_AVATAR_STORAGE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
