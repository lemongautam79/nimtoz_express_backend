import { PrismaClient } from '@prisma/client'
import express from 'express'
import { customLogger } from './middleware/morganLogger.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import corsOptions from './config/corsOptions.js'


//! Routes
import category from './routes/api/category.js'
import contact from './routes/api/contact.js'
import business from './routes/api/business.js'
import location from './routes/api/location.js'
import blog from './routes/api/blog.js'
import { countCategory } from './controllers/categoriesController.js';
import { restResponseTimeHistogram, startMetricsServer } from './utils/metrics.js';
import responseTime from 'response-time';

const PORT = process.env.PORT || 7000;

const app = express()
// startMetricsServer();

// app.use(responseTime((req, res, time) => {
//     if (req?.route?.path) {
//         restResponseTimeHistogram.observe({
//             method: req.method,
//             route: req.route.path,
//             status_code: res.statusCode
//         }, time * 1000)
//     }
// }))

app.use(cors(corsOptions))
app.use('/uploads', express.static('uploads'));

//! Built in middleware
//* built in middleware to handle urlencoded data or formdata
//* content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

//* middleware for json
app.use(express.json())
app.use(cookieParser())
app.use(customLogger)

//! Routes
app.use('/category', category)
app.use('/count_category', countCategory)
app.use('/contact', contact)
app.use('/business', business)
app.use('/location', location)
app.use('/blog', blog)

app.get('/404', (req, res) => {
    res.sendStatus(404);
})

app.get("/user", (req, res) => {
    try {
        throw new Error("Invalid user");
    } catch (error) {
        res.status(500).send("Error!");
    }
});

app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
); 