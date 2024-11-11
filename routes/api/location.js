import express from "express";
import { createLocation, deleteLocationById, getAllLocations, getLocationById, updateLocation } from "../../controllers/locationController.js";
import { authenticateToken, authorizeRole } from "../../middleware/authentication.js";

const router = express.Router();

router.route('/')
    .get(getAllLocations)
    .post(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), createLocation)

router.route('/:id')
    .get(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), getLocationById)
    .put(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), updateLocation)
    .delete(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), deleteLocationById)

export default router;