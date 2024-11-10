import express from "express";
import { createBusiness, deleteBusinessById, getAllBusinesses, getBusinessById, updateBusiness } from "../../controllers/businessController.js";

const router = express.Router();

router.route('/')
    .get(getAllBusinesses)
    .post(createBusiness)

router.route('/:id')
    .get(getBusinessById)
    .put(updateBusiness)
    .delete(deleteBusinessById)

export default router;