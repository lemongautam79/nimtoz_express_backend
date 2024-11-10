import express from "express";
import { createLocation, deleteLocationById, getAllLocations, getLocationById, updateLocation } from "../../controllers/locationController.js";

const router = express.Router();

router.route('/')
    .get(getAllLocations)
    .post(createLocation)

router.route('/:id')
    .get(getLocationById)
    .put(updateLocation)
    .delete(deleteLocationById)

export default router;