import { Request, Response } from 'express';

import { SelectCategories, SelectCategoryByID, CreateCategory, DeleteCategory, UpdateCategory } from '../models/Categories';

// Interface
import { Category } from '../interface/Category';

// Get all categories
export async function getCategories(req: Request, res: Response){
    const categories = await SelectCategories();
    return res.json(categories);
}

// Get a category
export async function getCategory(req:Request , res:Response): Promise<Response>{
    const id = req.params.categoryId;
    
    const category = await SelectCategoryByID(id);

    return res.json(category);
}

// Create a category
export async function createCategory(req:Request , res:Response): Promise<Response>{
    // Connect and Create Category
    const newCategory: Category = req.body;

    await CreateCategory(newCategory);

    // Response
    return res.json({
        message: 'Category Created'
    });
}

export async function deleteCategory(req:Request , res:Response): Promise<Response>{
    const id = req.params.categoryId;

    await DeleteCategory(id);

    return res.json({
        message: 'Category Deleted'
    });
}

export async function updateCategory(req:Request , res:Response): Promise<Response>{
    // Save params
    const id = req.params.categoryId;
    const updateCategory: Category = req.body;

    await UpdateCategory(updateCategory, id);

    // Response
    return res.json({
        message: 'Category Updated'
    });
}