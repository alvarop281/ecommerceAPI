import {Request, Response, NextFunction} from 'express';

import { SelectOrderById } from '../models/Orders';

export async function checkOwnerOrder(req: Request, res: Response, next: NextFunction){
    // Save request data
    const userReq: any = req.user;
    const orderId = req.params.orderId;
    const order = await SelectOrderById(orderId);
    
    // Only the same user can modify their own data
    try{
        if(order === undefined) return res.status(403).json({ error: 'Order does not exist'})
        if(userReq.id != order['user_id']) return res.status(403).json({ error: 'Unauthorized access'}); 
    }catch{}

    next();
}