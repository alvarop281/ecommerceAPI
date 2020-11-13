import { Request, Response } from 'express';

// Middleware to Validate the reques
import {validationResult} from 'express-validator';

// Connection to the database
import { connect } from '../database';

// Interface
import { Address } from '../interface/Address';

// Get all addresses from a user
export async function getAllFromUser(req: Request, res: Response): Promise<Response>{
    // Save request data
    const id = req.params.userId;

    // Connection to db
    const conn = await connect();
    const address = await conn.query('SELECT * FROM addresses WHERE addresses.user_id =?', [id]);

    // Response
    return res.json(address[0]);
}

// Get a address from a user
export async function getAddressFromUser(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userId = req.params.userId;
    const addressId = req.params.addressId;

    // Connection to db
    const conn = await connect();
    const address = await conn.query('SELECT * FROM addresses WHERE addresses.user_id =? AND addresses.id =?', [userId, addressId]);

    // Response
    return res.json(address[0]);
}


// Create a address
export async function createAddress(req: Request, res: Response): Promise<Response>{
    const userId = req.params.userId;

    // Connect and create a new address
    const conn = await connect();
    const newAddress: Address = req.body;
    newAddress['user_id'] = userId;

    await conn.query('INSERT INTO addresses SET ?', [newAddress]);

    // Success Response
    return res.json({
        message: "Address Created"
    });
}

// Delete a address from a user
export async function deleteAddressFromUser(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userId = req.params.userId;
    const addressId = req.params.addressId;

    // Connection to db
    const conn = await connect();
    const address = await conn.query('DELETE FROM addresses WHERE addresses.user_id =? AND addresses.id =?', [userId, addressId]);

    // Response
    return res.json({
        message: 'Address Deleted'
    });
}


// Update a address from a user
export async function UpdateAddressFromUser(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userId = req.params.userId;
    const addressId = req.params.addressId;
    const updateAddress: Address = req.body;

    // Connection to db
    const conn = await connect();
    const address = await conn.query('UPDATE addresses SET ? WHERE addresses.user_id =? AND addresses.id =?', [updateAddress, userId, addressId]);

    // Response
    return res.json({
        message: 'Address Updated'
    });
}