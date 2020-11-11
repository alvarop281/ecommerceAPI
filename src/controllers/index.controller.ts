import {Request, Response} from 'express';

export function IndexWelcome(req: Request, res: Response): Response{
    return res.json({message: 'Welcome to NatuFit API'});
}