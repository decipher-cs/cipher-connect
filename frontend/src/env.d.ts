/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_SERVER_PROD_URL: string
    readonly VITE_SERVER_DEV_URL: string
    readonly VITE_CLIENT_PROD_URL: string
    readonly VITE_CLIENT_DEV_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
