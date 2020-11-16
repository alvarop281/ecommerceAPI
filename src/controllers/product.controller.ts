import {Request, Response} from 'express';

// Connection to the database
import { connect } from '../database';

// Interface Product
import { Product } from '../interface/Product';

import { SelectProducts, SelectProductByID, CreateProduct, DeleteProduct, UpdateProduct } from '../models/Products';

// Get all products
export async function getProducts(req: Request, res: Response): Promise<Response>{
    
    const products = await SelectProducts();
    return res.json(products);
}

// Get a product
export async function getProduct(req: Request, res: Response): Promise<Response>{
    const id = req.params.productId;

    const product = await SelectProductByID(id);

    return res.json(product);
}

// Get all products from Items 
export async function getProductFromItems(req: Request, res: Response): Promise<Response>{
    const id = req.params.itemId;

    // Connection to db
    const conn = await connect();
    const product = await conn.query('SELECT * FROM products WHERE products.item_id =?', [id]);

    return res.json(product[0]);
}

// Create a product
export async function createProduct(req: Request, res: Response): Promise<Response>{
    // Connect and create a new product
    const conn = await connect();
    const newProduct: Product = req.body;

    newProduct['status'] = 'active';        //Default value

    // Models
    await CreateProduct(newProduct);

    // Success Response
    return res.json({
        message: "Product Created"
    });
}

// Delete a product
export async function deleteProduct(req: Request, res: Response): Promise<Response>{
    const id = req.params.productId;

    // Models
    await DeleteProduct(id);

    // Success Response
    return res.json({
        message: "Product Deleted"
    });
}

// Update a product
export async function updateProduct(req: Request, res: Response): Promise<Response>{
    // Save the params
    const id = req.params.productId;
    const updateProduct: Product = req.body;

    // if there are no products, their status must change to inactive
    if(updateProduct['quantity'] === 0){
        updateProduct['status'] = 'inactive';
    }else{
        updateProduct['status'] = 'active'; 
    }

    await UpdateProduct(updateProduct, id);

    // Success Response
    return res.json({
        message: "Product Updated"
    });
}