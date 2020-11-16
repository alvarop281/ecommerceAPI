import {Request, Response, NextFunction} from 'express';

import { SelectDetailsById } from '../models/Details';

export async function DetailBelongsOrder(req: Request, res: Response, next: NextFunction){
    // Save request data
    const orderId = req.params.orderId;
    const detailId = req.params.detailId;
    const detail = await SelectDetailsById(detailId);
    
    // Only the same user can modify their own data
    try{
        if(detail === undefined) return res.status(403).json({ error: 'Detail does not exist'})
        if(detail['order_id'].id != orderId) return res.status(403).json({ error: 'Unauthorized access'}); 
    }catch{}

    next();
}