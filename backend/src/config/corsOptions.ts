import { CorsOptions } from 'cors'
import cors from 'cors'

export const corsWithOptions = () => {
    const whitelist =
        process.env.NODE_ENV === 'production'
            ? [process.env.CLIENT_URL]
            : [
                  process.env.CLIENT_URL,
                  'http://localhost:4173',
                  'http://192.168.1.10:5173',
                  'https://192.168.1.10:5173',
                  'https://192.168.1.10:5173/',
                  'https://192.168.1.10',
                  'https://192.168.1.10/',
              ]

    const corsOption: CorsOptions = {
        credentials: true,
        origin(requestOrigin, callback) {
            if (process.env.NODE_ENV === 'development') {
                callback(null, true)
            } else if (!requestOrigin || !whitelist.includes(requestOrigin)) {
                callback(new Error(requestOrigin + ' not allowed by CORS'))
            } else {
                callback(null, true)
            }
        },
        optionsSuccessStatus: 200,
    }

    return cors(corsOption)
}
