import {Request, Response, NextFunction} from 'express';

export function checkAdmin(req: Request, res: Response, next: NextFunction){

    // Save request data
    const userReq: any = req.user;

    if(userReq[0].type_of_user === 'buyer') return res.status(403).json('Unauthorized access');

    if(userReq[0].type_of_user === 'admin') return next();
    
    return res.status(403).json('Unauthorized access');
}