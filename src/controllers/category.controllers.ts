import { Request, Response } from 'express';

// Validator
import {validationResult} from 'express-validator';

// Connection to the database
import { connect } from '../database';

// Interface
import { Category } from '../interface/Category';

// Get all categories
export async function getCategories(req: Request, res: Response){
    const conn = await connect();
    const categories = await conn.query('SELECT * FROM categories');
    return res.json(categories[0]);
}

// Get a category
export async function getCategory(req:Request , res:Response): Promise<Response>{
    const id = req.params.categoryId;
    const conn = await connect();
    const category = await conn.query('SELECT * FROM categories WHERE categories.id =?', [id]);

    return res.json(category[0]);
}

// Create a category
export async function createCategory(req:Request , res:Response): Promise<Response>{
    // Check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    // Connect and Create Category
    const newCategory: Category = req.body;
    const conn = await connect();
    await conn.query('INSERT INTO categories SET ?', [newCategory]);

    // Response
    return res.json({
        message: 'Category Created'
    });
}

export async function deleteCategory(req:Request , res:Response): Promise<Response>{
    const id = req.params.categoryId;
    const conn = await connect();
    const category = await conn.query('DELETE FROM categories WHERE categories.id =?', [id]);

    return res.json({
        message: 'Category Deleted'
    });
}

export async function updateCategory(req:Request , res:Response): Promise<Response>{
    // Check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    // Save params
    const id = req.params.categoryId;
    const updateCategory: Category = req.body;

    // Connect and Update Category
    const conn = await connect();
    await conn.query('UPDATE categories SET ? WHERE categories.id = ?', [updateCategory, id]);

    // Response
    return res.json({
        message: 'Category Updated'
    });
}