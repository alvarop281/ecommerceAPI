import { Request, response, Response } from 'express';
import fs from 'fs';

// Middleware to Validate the reques
import {validationResult} from 'express-validator';

// Connection to the database
import { connect } from '../database';

// Interface Item
import { Item } from '../interface/Item';

// Get all Items
export async function getItems(req: Request, res: Response): Promise<Response>{
    const conn = await connect();
    const items = await conn.query('SELECT * FROM items');
    return res.json(items[0]);
}

// Get an item
export async function getItem(req: Request, res: Response): Promise<Response>{
    const id = req.params.itemId;
    // Connection to db
    const conn = await connect();
    const item = await conn.query('SELECT * FROM items WHERE items.id =?', [id]);

    // Response
    return res.json(item[0]);
}

// Get all item from Category
export async function getItemFromCategory(req: Request, res: Response): Promise<Response>{
    const id = req.params.categoryId;
    // Connection to db
    const conn = await connect();
    const item = await conn.query('SELECT * FROM items WHERE items.category_id =?', [id]);

    // Response
    return res.json(item[0]);
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

    // Connect and create a new item
    const conn = await connect();
    await conn.query('INSERT INTO items SET ?', [newItem]);

    // Success Response
    return res.json({
        message: "Item Created"
    });
}

// Delete an item
export async function deleteItem(req: Request, res: Response): Promise<Response>{
    
    // Save params
    const id = req.params.itemId;

    // Connection to db
    const conn = await connect();
    
    // Get image name to delere
    const oldImage: any = await conn.query(`SELECT items.image FROM items WHERE items.id = ${id}`);
    const oldImg: string = oldImage[0][0]['image'];

    // Try to delete image
    if(oldImg !== '' && oldImg !== null){
        try {
            fs.unlinkSync('./uploads/' + oldImg)
        } catch(err) {
            return res.status(400).json({ errors: err });
        }
    }

    // Delete resource    
    await conn.query('DELETE FROM items WHERE items.id =?', [id]);

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

    const conn = await connect();

    // Save and store image
    if(req.files){
        const image = req.files.image;
        updateItem['image'] = image.name;

        // Validate the file type
        if(image.mimetype !== 'image/png'){
            return res.status(400).json({ errors: 'The file type is invalid' });
        }



        // Get the name of the previous image to delete it
        const oldImage: any = await conn.query(`SELECT items.image FROM items WHERE items.id = ${id}`);
        const oldImg: string = oldImage[0][0]['image'];

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

    
    // Connect and Update
    await conn.query('UPDATE items SET ? WHERE items.id = ?', [updateItem, id]);

    // Success Response
    return res.json({
        message: "Item Updated"
    });
}