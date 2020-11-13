import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';

import { UPayload } from '../interface/UPayload';

export function verifyToken(req: Request, res: Response, next: NextFunction){
    
    // Check for errors in the request
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    const token = req.header('auth-token');
    
    if(!token) return res.status(401).json('Access denied');

    const payload = jwt.verify(token, process.env.TOKEN_SECRET|| 'secretToken') as UPayload;
    req.user = payload.user;

    next();
}