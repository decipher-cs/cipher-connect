import { CorsOptions } from 'cors'
import cors from 'cors'

export const corsWithOptions = () => {
    const whitelist = process.env.CLIENT_URL

    const corsOption: CorsOptions = {
        credentials: true,
        origin(requestOrigin, callback) {
            if (process.env.NODE_ENV === 'development') {
                callback(null, true)
            } else if (requestOrigin === undefined || whitelist.includes(requestOrigin) === false) {
                callback(new Error(requestOrigin + ' not allowed by CORS'))
            } else {
                callback(null, true)
            }
        },
        optionsSuccessStatus: 200,
    }

    return cors(corsOption)
}
