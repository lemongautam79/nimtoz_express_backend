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
import eventType from './routes/api/eventType.js'
import forgotPassword from './routes/api/forgotPassword.js'
import resetPassword from './routes/api/resetPassword.js'

import { countCategory } from './controllers/categoriesController.js';

const PORT = process.env.PORT || 7000;

const app = express()

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
app.use('/user', user)
app.use('/product', product)
app.use('/eventtype', eventType)

app.use('/login', login)
app.use('/refresh_token', refresh)
app.use('/forgot-password', forgotPassword)
app.use('/reset-password', resetPassword)

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

const ip = "0.0.0.0"

app.listen(PORT, ip, () =>
    console.log(`Server running at http://localhost:${PORT}-${ip}`)
); 