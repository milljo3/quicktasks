import jwt = require('jsonwebtoken');
import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';

const decodedTokenSchema = z.object({
    id: z.number(),
    username: z.string(),
    iat: z.number(),
    exp: z.number(),
});

export interface AuthenticatedRequest extends Request {
    userId?: number;
    username?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: 'No token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const result = decodedTokenSchema.safeParse(decoded);

        if (!result.success) {
            return res.status(401).json({message: 'Invalid token payload'});
        }

        req.userId = result.data.id;
        req.username = result.data.username;
        next();
    }
    catch (error) {
        return res.status(401).json({message: 'Invalid token', error: error});
    }
}