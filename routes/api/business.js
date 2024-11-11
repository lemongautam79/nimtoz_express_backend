import express from "express";
import { createBusiness, deleteBusinessById, getAllBusinesses, getBusinessById, updateBusiness } from "../../controllers/businessController.js";
import { authenticateToken, authorizeRole } from "../../middleware/authentication.js";

const router = express.Router();

router.route('/')
    .get(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), getAllBusinesses)
    .post(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), createBusiness)

router.route('/:id')
    .get(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), getBusinessById)
    .put(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), updateBusiness)
    .delete(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), deleteBusinessById)

export default router;