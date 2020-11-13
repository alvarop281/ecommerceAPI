import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Validator
import {validationResult} from 'express-validator';

// Connection to the database
import { connect } from '../database';

// Interface User
import { User } from '../interface/User';

// Login a user
export async function login(req:Request , res:Response){   
    const email = req.body.email;
    const conn = await connect();

    try{
        // Find the user data and Save password
        const user: any = await conn.query('SELECT * FROM users WHERE users.email =?', [email]);
        const passCredential = user[0][0]['password'];
        conn.end();

        // Compare password
        const isValid = await bcrypt.compare(req.body.password, passCredential)
        if(!isValid) return res.status(400).json({ errors: "Invalid email and password!" }); 

        // Create and return token
        const token: string = jwt.sign({user: user[0]}, process.env.TOKEN_SECRET|| 'secretToken', {
            expiresIn: 60 * 60 * 24 * 31
        });
        return res.json({user: user[0],token});

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

    // Connect and create a new user
    const conn = await connect();
    await conn.query('INSERT INTO users SET ?', [newUser]);

    // Retrieve user_id to create the token
    const user: any = await conn.query('SELECT * FROM users WHERE users.email =?', [newUser['email']]);
    const token: string = jwt.sign({user: user[0]}, process.env.TOKEN_SECRET|| 'secretToken', {
        expiresIn: 60 * 60 * 24 * 31
    });

    conn.end();

    // Success Response
    return res.json({
        message: "User Created",
        token
    });
}

export async function profile(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userReq: any = req.user;
    const id = userReq[0].id;

    // Connection to db
    const conn = await connect();
    const user = await conn.query('SELECT * FROM users WHERE users.id =?', [id]);

    return res.json(user[0]);
}