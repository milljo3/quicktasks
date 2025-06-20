// @ts-ignore
import express from 'express';
import {Request, Response} from "express";
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import prisma from '../prismaClient';
import {z} from 'zod';
import {validateBody} from "../middleware/validate";
import {authSchema} from "../schemas/authSchemas";

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
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET, {expiresIn: '1h'});

        // Respond with the JWT token and a success message
        return res.status(201).send({token, email, message: 'User created successfully'});
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
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET, {expiresIn: '1h'});

        // Respond with the JWT token and a success message
        return res.status(200).send({token, email, message: "Login success"});
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({message: error.errors});
        }
        return res.status(400).send({message: 'Server Error'});
    }
});

export default router;