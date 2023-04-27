declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SECRET: string
            DEV_PORT: number
        }
    }
}

export {}
