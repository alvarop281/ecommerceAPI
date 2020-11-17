import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Connection to the database
import { connect } from '../database';

// Interface User
import { User } from '../interface/User';

// Model
import {SelectUserByID, SelectUserByEmail, CreateUser} from '../models/Users';

// Login a user
export async function login(req:Request , res:Response){   
    const email = req.body.email;

    try{
        // Find the user data and Save password
        const user: User = await SelectUserByEmail(email);
        const passCredential = user['password'];

        // Compare password
        const isValid = await bcrypt.compare(req.body.password, passCredential)
        if(!isValid) return res.status(400).json({ errors: "Invalid email and password!" }); 

        // Create and return token
        const token: string = jwt.sign({user}, process.env.TOKEN_SECRET|| 'secretToken', {
            expiresIn: 60 * 60 * 24 * 31
        });
        return res.json({user: user,token});

    } catch(err) {
        return res.status(400).json({ errors: "Invalid email and password!" });
    }    
}

// Create a user
export async function signin(req: Request, res: Response): Promise<Response>{
    // Store and maintain data
    const newUser: User = req.body;
    newUser['type_of_user'] = 'buyer';
    newUser['password'] = bcrypt.hashSync(req.body.password.toString(), 10);

    // Model
    await CreateUser(newUser);

    // Retrieve user_id to create the token
    const user: User = await SelectUserByEmail(newUser['email']);
    const token: string = jwt.sign({user}, process.env.TOKEN_SECRET|| 'secretToken', {
        expiresIn: 60 * 60 * 24 * 31
    });

    // Success Response
    return res.json({
        message: "User Created",
        token
    });
}

export async function profile(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userReq: any = req.user;
    const id = userReq.id;
    // Model
    const user = await SelectUserByID(id);

    return res.json(user);
}