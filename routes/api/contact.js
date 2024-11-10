import express from "express";
import { createContact, deleteContactById, getAllContacts, getContactsById, updateContact } from "../../controllers/contactController.js";

const router = express.Router();

router.route('/')
    .get(getAllContacts)
    .post(createContact)

router.route('/:id')
    .get(getContactsById)
    .put(updateContact)
    .delete(deleteContactById)

export default router;
