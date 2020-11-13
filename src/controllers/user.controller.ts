import {Request, Response} from 'express';
import bcrypt from 'bcrypt';

// Middleware
import {body, validationResult} from 'express-validator';

// Connection to the database
import { connect } from '../database';

// Interface User
import { User } from '../interface/User';

// Get all users
export async function getUsers(req: Request, res: Response): Promise<Response>{
    const conn = await connect();
    const users = await conn.query('SELECT * FROM users');
    return res.json(users[0]);
}

// Delete a user
export async function deleteUser(req: Request, res: Response): Promise<Response>{
    const id = req.params.userId;

    // Connection to db
    const conn = await connect();
    await conn.query('DELETE FROM users WHERE users.id =?', [id]);

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

    // Connect and Update
    const conn = await connect();
    await conn.query('UPDATE users SET ? WHERE users.id = ?', [updateUser, id]);

    // Success Response
    return res.json({
        message: "User Updated"
    });
}