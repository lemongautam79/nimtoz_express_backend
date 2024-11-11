import express from "express";
import { createContact, deleteContactById, getAllContacts, getContactsById, updateContact } from "../../controllers/contactController.js";
import { authenticateToken, authorizeRole } from "../../middleware/authentication.js";

const router = express.Router();

router.route('/')
    .get(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), getAllContacts)
    .post(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), createContact)

router.route('/:id')
    .get(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), getContactsById)
    .put(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), updateContact)
    .delete(authenticateToken, authorizeRole('SUPER_ADMIN', 'ADMIN'), deleteContactById)

export default router;
