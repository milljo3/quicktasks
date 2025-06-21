import jwt = require('jsonwebtoken');
import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';

const decodedTokenSchema = z.object({
    id: z.string(),
    iat: z.number(),
    exp: z.number(),
});

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Invalid authorization header format'});
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        const result = decodedTokenSchema.safeParse(decoded);

        if (!result.success) {
            return res.status(401).json({message: 'Invalid token payload'});
        }

        req.userId = result.data.id;
        next();
    }
    catch (error) {
        console.error('JWT verification failed:', error);

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: 'Token expired'});
        }

        return res.status(401).json({message: 'Invalid token'});
    }
}