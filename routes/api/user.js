import express from "express";
import { createUser, deleteUserById, getAllUsers, getUserById, updateUser } from "../../controllers/registerController.js";

const router = express.Router();

router.route('/')
    .get(getAllUsers)
    .post(createUser)

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUserById)

export default router;