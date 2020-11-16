// Connection to the database
import { connect } from '../database';

export async function SelectProductByID(id: number | String){   
    const conn = await connect();
    const product: any = await conn.query('SELECT * FROM products WHERE id = ?', [id]);
    conn.end();

    return product[0][0];
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