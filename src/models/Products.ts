// Connection to the database
import { connect } from '../database';
import { Product } from '../interface/Product';

export async function SelectProductByID(id: number | String){   
    const conn = await connect();
    const product: any = await conn.query('SELECT * FROM products WHERE id = ?', [id]);
    conn.end();

    return product[0][0];
}

export async function SelectProductByItem(id: number | String){   
    const conn = await connect();
    const product: any = await conn.query('SELECT * FROM products WHERE products.item_id =?', [id]);
    conn.end();

    return product[0];
}

export async function SelectProducts(){   
    const conn = await connect();
    const products: any = await conn.query('SELECT * FROM products');
    conn.end();

    return products[0];
}


export async function CreateProduct(newProduct: Product){
    const conn = await connect();

    await conn.query('INSERT INTO products SET ?', [newProduct]);
    conn.end();

    return 0;
}

export async function DeleteProduct(id: number | string){
    const conn = await connect();

    await conn.query('DELETE FROM products WHERE products.id =?', [id]);
    conn.end();

    return 0;
}

export async function UpdateProduct(updateProduct: Product, id: number | String){
    const conn = await connect();

    await conn.query('UPDATE products SET ? WHERE products.id = ?', [updateProduct, id]);
    conn.end();

    return 0;
}

export async function updateToDeleteDetail(id: number | string, quantity: number){
    const conn = await connect();
    const product: any = await conn.query('SELECT * FROM products WHERE id = ?', [id]);
    
    product[0][0]['quantity'] += quantity;
    
    if(product[0][0]['quantity'] === 0) product[0][0]['status'] = 'inactive';
    else product[0][0]['status'] = 'active';
    
    await conn.query('UPDATE products SET ? WHERE products.id = ?', [product[0][0], id]);
    conn.end();

    return 0;
}

export async function updateQuantity(id: number | string, quantity: number){
    const conn = await connect();
    const product: any = await conn.query('SELECT * FROM products WHERE id = ?', [id]);
    
    product[0][0]['quantity'] = quantity;
    
    if(product[0][0]['quantity'] === 0) product[0][0]['status'] = 'inactive';
    else product[0][0]['status'] = 'active';
    
    await conn.query('UPDATE products SET ? WHERE products.id = ?', [product[0][0], id]);
    conn.end();

    return 0;
}