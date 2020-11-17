import { Request, Response } from 'express';

// Interface
import { Address } from '../interface/Address';

// Address Model
import {SelectAddressessFromUser, SelectAddressByID, CreateAddress, DeleteAddress, UpdateAddress} from '../models/Addresses';

// Get all addresses from a user
export async function getAllFromUser(req: Request, res: Response): Promise<Response>{
    // Save request data
    const id = req.params.userId;

    // Address Model
    const address = await SelectAddressessFromUser(id);

    // Response
    return res.json(address);
}

// Get a address from a user
export async function getAddressFromUser(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userId = req.params.userId;
    const addressId = req.params.addressId;

    // Address Model
    const address = await SelectAddressByID(userId, addressId);

    // Response
    return res.json(address);
}


// Create a address
export async function createAddress(req: Request, res: Response): Promise<Response>{
    const userId = req.params.userId;
    const newAddress: Address = req.body;
    newAddress['user_id'] = userId;

    // Address Model
    await CreateAddress(newAddress);

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

    // Address Model
    await DeleteAddress(userId, addressId);

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

    // Addres Model
    await UpdateAddress(updateAddress, userId, addressId);

    // Response
    return res.json({
        message: 'Address Updated'
    });
}