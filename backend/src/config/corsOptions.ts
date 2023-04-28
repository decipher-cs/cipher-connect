import { CorsOptions } from 'cors'
import cors from 'cors'

export const corsWithOptions = () => {
    const whitelist =
        process.env.NODE_ENV === 'production'
            ? [process.env.ORIGIN_PROD_URL]
            : ['http://localhost:5173/', 'http://192.168.1.3:5173/']

    const corsOption: CorsOptions = {
        origin(requestOrigin, callback) {
            if (requestOrigin === undefined || whitelist.includes(requestOrigin) === false) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        optionsSuccessStatus: 200,
    }

    return cors(corsOption)
}
