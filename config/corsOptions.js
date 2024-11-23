import { allowedOrigins } from './allowedOrigins.js';

// const corsOptions = {
//     // origin: (origin, callback) => {
//     //     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//     //         callback(null, true);
//     //     } else {
//     //         callback(new Error('Not allowed by CORS'));
//     //     }
//     // },
//     origin: true,
//     optionsSuccessStatus: 200
// };

const corsOptions = {
    origin: ['https://nimtoz.com', 'https://www.nimtoz.com', 'http:localhost:3000'], // Allow your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Enable cookies/auth headers if required
};

export default corsOptions;
