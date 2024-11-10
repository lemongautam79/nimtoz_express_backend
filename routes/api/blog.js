import express from 'express'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createBlog, deleteBlogById, getAllBlogs, getBlogById, updateBlog } from '../../controllers/blogController.js';


const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/blogs';
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
    .get(getAllBlogs)
    .post(upload.single('image'), createBlog)

router.route('/:id')
    .get(getBlogById)
    .put(upload.single('image'), updateBlog)
    .delete(deleteBlogById)

export default router;