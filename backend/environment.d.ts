declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | undefined // Cant be development unless NODE_ENV=development is set in the scripts insdie package.json
            SECRET: string
            DEV_PORT: number
            ORIGIN_DEV_URL: string
            // ORIGIN_PROD_URL: string
        }
    }
}

export {}
