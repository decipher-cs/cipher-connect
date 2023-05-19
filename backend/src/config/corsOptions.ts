import { CorsOptions } from 'cors'
import cors from 'cors'

export const corsWithOptions = () => {
    const whitelist =
        process.env.NODE_ENV === 'production'
            ? [process.env.ORIGIN_PROD_URL]
            : ['http://localhost:5173', 'http://192.168.1.3:5173/']
    console.log('allowed origins are:', whitelist)
    const corsOption: CorsOptions = {
        credentials: true,
        origin(requestOrigin, callback) {
            if (requestOrigin === undefined || whitelist.includes(requestOrigin) === false) {
                callback(new Error(requestOrigin + ' not allowed by CORS'))
            } else {
                callback(null, true)
            }
        },
        optionsSuccessStatus: 200,
    }

    return cors(corsOption)
}
