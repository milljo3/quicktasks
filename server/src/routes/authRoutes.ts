// @ts-ignore
import express from 'express';
import {Request, Response} from "express";
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import prisma from '../prismaClient';
import {z} from 'zod';
import {validateBody} from "../middleware/validate";
import {authSchema} from "../schemas/authSchemas";
import {AuthenticatedRequest, requireAuth} from "../middleware/auth";

const router = express.Router();

// Register route to handle user registration
router.post('/register', validateBody(authSchema), async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {email}
        });
        if (existingUser) {
            return res.status(400).send({message: 'Email already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET, {expiresIn: '1h'});

        return res.status(201).send({
            token,
            user: {
                id: user.id,
                email
            }
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({message: error.errors});
        }
        return res.status(400).send({message: 'Server Error', error: error.message});
    }
});


// Login route to handle user authentication
router.post('/login', validateBody(authSchema), async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where: {email}
        });
        if (!user) {
            return res.status(400).send({message: 'Email or password is incorrect'});
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).send({message: 'Invalid email or password'});
        }

        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET, {expiresIn: '1h'});

        return res.status(200).send({
            token,
            user: {
                id: user.id,
                email
            }
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({message: error.errors});
        }
        return res.status(400).send({message: 'Server Error'});
    }
});

router.get('/verify', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId!;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                id: true,
                email: true
            }
        });

        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        res.status(200).send({
            user: user
        });
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
})

export default router;