import express from "express"
import { getAllCounts } from "./dashboardController.js"

const router = express.Router()

router.route('/')
    .get(getAllCounts)

export default router;