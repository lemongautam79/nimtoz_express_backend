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
import user from './routes/api/user.js'
import login from './routes/api/login.js'
import refresh from './routes/api/refresh.js'
import product from './routes/api/product.js'
import booking from './routes/api/booking.js'
import eventType from './routes/api/eventType.js'
import forgotPassword from './routes/api/forgotPassword.js'
import resetPassword from './routes/api/resetPassword.js'
import stats from './routes/api/statistics.js'
import compression from 'compression'
import { countCategory, getCategoryByProductId } from './controllers/categoriesController.js';
import { getTopBookers } from './controllers/registerController.js';
import { getBookingStats } from './controllers/bookingController.js';
import { getHomePageProducts, getProductImagesById } from './controllers/productController.js';
import { getStatBlogs } from './controllers/blogController.js';
import { globalErrorHandler } from './middleware/globalErrorHandler.js';

const PORT = process.env.PORT || 7000;

const app = express()

// app.use(compression({
//     threshold: 102400,  // Compress only if the response is larger than 100 KB
//     filter: (req, res) => {
//         // Optional: Apply custom filtering logic for which responses should be compressed
//         return res.statusCode === 200;  // Only compress 200 OK responses
//     }
// }));

// app.use(cors(corsOptions))
app.use(cors())
app.options('*', cors());
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
app.use('/topbookers', getTopBookers)
app.use('/contact', contact)
app.use('/business', business)
app.use('/location', location)
app.use('/blog', blog)
app.use('/user', user)
app.use('/product', product)
app.use('/booking', booking)
app.use('/eventtype', eventType)

app.use('/login', login)
app.use('/refresh_token', refresh)
app.use('/forgot-password', forgotPassword)
app.use('/reset-password', resetPassword)
app.use('/stats', stats)
app.use('/homepageproducts', getHomePageProducts)
app.use('/bookingstats', getBookingStats)
app.use('/productimages/:id', getProductImagesById)
app.use('/productcategoryid/:id', getCategoryByProductId)
app.use('/stat-blogs', getStatBlogs)

app.get('/404', (req, res) => {
    res.sendStatus(404);
})

app.get("*", (req, res, next) => {
    const err = new Error(`${req.originalUrl} doesn't exist`);
    err.statusCode = 404;
    err.status = 'fail';
    next(err)
})

app.use(globalErrorHandler)

const ip = "0.0.0.0"

app.listen(PORT, ip, () =>
    console.log(`Server running at http://localhost:${PORT}-${ip}`)
); 