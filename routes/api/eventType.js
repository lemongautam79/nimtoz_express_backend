import express from "express";
import { createEventType, deleteEventTypeById, getAllEventTypes, getEventTypeById, updateEventType } from "../../controllers/eventTypeController.js";

const router = express.Router();

router.route('/')
    .get(getAllEventTypes)
    .post(createEventType)

router.route("/:id")
    .get(getEventTypeById)
    .put(updateEventType)
    .delete(deleteEventTypeById)

export default router;