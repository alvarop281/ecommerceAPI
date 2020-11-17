import {Request, Response} from 'express';
import bcrypt from 'bcrypt';

// Interface
import { User } from '../interface/User';
// Model
import {SelectUser, DeleteUser, UpdateUser} from '../models/Users';

// Get all users
export async function getUsers(req: Request, res: Response): Promise<Response>{
    // Users Model
    const users = await SelectUser()
    return res.json(users);
}

// Delete a user
export async function deleteUser(req: Request, res: Response): Promise<Response>{
    const id = req.params.userId;

    // User Model
    await DeleteUser(id);

    // Success Response
    return res.json({
        message: "User Deleted"
    });
}

// Update a user
export async function updateUser(req: Request, res: Response): Promise<Response>{
    // Save the params
    const id = req.params.userId;
    const updateUser: User = req.body;
    if(req.body.password){
        updateUser['password'] = bcrypt.hashSync(req.body.password.toString(), 10);
    }

    // User Model
    await UpdateUser(updateUser, id);

    // Success Response
    return res.json({
        message: "User Updated"
    });
}