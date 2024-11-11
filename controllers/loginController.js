import bcrypt from 'bcrypt'
import { generateAccesstoken, generateRefreshToken } from "../auth/generateTokens.js";
import { PrismaClient } from '@prisma/client';
import { loginSchema } from '../utils/validationSchema.js';
import { z } from 'zod'

const prisma = new PrismaClient();

//! Login User
const loginUser = async (req, res) => {
    const validatedData = loginSchema.parse(req.body)
    const { email, password } = validatedData;

    const foundUser = await prisma.user.findUnique({ where: { email } })

    if (!foundUser) return res.status(404).json({ success: false, message: "User Not found" })

    const validPassword = await bcrypt.compare(password, foundUser.password);

    if (!validPassword) return res.status(401).json({ success: false, message: 'Invalid password' });

    const accessToken = generateAccesstoken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    try {
        const updatedUser = await prisma.user.update({
            where: { id: foundUser.id },
            data: { refreshToken }
        });

        return res.json({ accessToken, refreshToken, user: updatedUser })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.errors.map((e) => e.message)
            });
        }
        res.status(400).json({ success: false, error: error.message });
    }
}

export {
    loginUser
}