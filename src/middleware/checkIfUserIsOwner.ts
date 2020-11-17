import {Request, Response, NextFunction} from 'express';

export function checkOwner(req: Request, res: Response, next: NextFunction){

    // Save request data
    const userId = req.params.userId;
    const userReq: any = req.user;
    // Only the same user can modify their own data
    if(userReq.id != userId) return res.status(403).json({ error: 'Unauthorized access'}); 

    next();
}