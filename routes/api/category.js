import express from 'express'

import { createCategory, deleteCategoryById, getAllCategories, getCategoryById, updateCategory } from '../../controllers/categoriesController.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, authorizeRole } from '../../middleware/authentication.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/categories';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    }, 
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.route('/')
    .get(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN','USER'), getAllCategories)
    .post(upload.single('category_icon'), authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), createCategory)

router.route('/:id')
    .get(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), getCategoryById)
    .put(upload.single('category_icon'), authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), updateCategory)
    .delete(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), deleteCategoryById)

export default router;