import { Request, Response } from 'express';
import fs from 'fs';

// Connection to the database
import { connect } from '../database';

// Interface Item
import { Item } from '../interface/Item';

// Item Model
import {SelectItems, SelectItemByID, SelectItemByCategory, CreateItem, DeleteItem, UpdateItem } from '../models/Items'; 

// Get all Items
export async function getItems(req: Request, res: Response): Promise<Response>{
    // Item Model
    const items = await SelectItems();
    return res.json(items);
}

// Get an item
export async function getItem(req: Request, res: Response): Promise<Response>{
    const id = req.params.itemId;
    // Item Model
    const item = await SelectItemByID(id);
    // Response
    return res.json(item);
}

// Get all item from Category
export async function getItemFromCategory(req: Request, res: Response): Promise<Response>{
    const id = req.params.categoryId;
    // Item Model
    const item = await SelectItemByCategory(id);
    // Response
    return res.json(item);
}


// Create an item
export async function createItem(req: Request, res: Response): Promise<Response>{
    // Save params
    const newItem: Item = req.body;

    // Save and store image
    if(req.files){
        const image = req.files.image;
        newItem['image'] = image.name;

        // Validate the file type
        if(image.mimetype !== 'image/png'){
            return res.status(400).json({ errors: 'The file type is invalid' });
        }

        // Store file
        image.mv('./uploads/' + image.name, function (error){
            if(error){
                return res.status(400).json({ errors: error });
            }
        });
    }

    // Item Model
    await CreateItem(newItem);

    // Success Response
    return res.json({
        message: "Item Created"
    });
}

// Delete an item
export async function deleteItem(req: Request, res: Response): Promise<Response>{
    // Save params
    const id = req.params.itemId;
    // Get image name to delere
    const oldImage: any = await SelectItemByID(id);
    const oldImg: string = oldImage['image'];

    // Try to delete image
    if(oldImg !== '' && oldImg !== null){
        try {
            fs.unlinkSync('./uploads/' + oldImg)
        } catch(err) {
            return res.status(400).json({ errors: err });
        }
    }

    // Delete resource    
    await DeleteItem(id);

    // Success Response
    return res.json({
        message: "Item Deleted"
    });
}


// Update an item
export async function updateItem(req: Request, res: Response): Promise<Response>{
    // Save the params
    const id = req.params.itemId;
    const updateItem: Item = req.body;

    // Save and store image
    if(req.files){
        const image = req.files.image;
        updateItem['image'] = image.name;

        // Validate the file type
        if(image.mimetype !== 'image/png'){
            return res.status(400).json({ errors: 'The file type is invalid' });
        }

        // Get the name of the previous image to delete it
        const oldImage: any = await SelectItemByID(id);
        const oldImg: string = oldImage['image'];

        // Try to delete old image
        if(oldImg !== '' && oldImg !== null){
            try {
                fs.unlinkSync('./uploads/' + oldImg)
            } catch(err) {
                return res.status(400).json({ errors: err });
            }
        }

        // Store file
        image.mv('./uploads/' + image.name, function (error){
            if(error){
                return res.status(400).json({ errors: error });
            }
        });
    }

    // Item Model
    await UpdateItem(updateItem, id);

    // Success Response
    return res.json({
        message: "Item Updated"
    });
}