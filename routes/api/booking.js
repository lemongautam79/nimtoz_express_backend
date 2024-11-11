import express from "express"
import { createBooking, deleteBookingById, getAllBookings, getBookingById, updateBooking } from "../../controllers/bookingController.js"

const router = express.Router()

router.route("/")
    .get(getAllBookings)
    .post(createBooking)

router.route("/:id")
    .get(getBookingById)
    .put(updateBooking)
    .delete(deleteBookingById)

export default router;