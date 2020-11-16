// Connection to the database
import { connect } from '../database';
import { Category } from '../interface/Category';

export async function SelectCategoryByID(id: number | String){   
    const conn = await connect();
    const category: any = await conn.query('SELECT * FROM categories WHERE id = ?', [id]);
    conn.end();

    return category[0][0];
}

export async function SelectCategories(){   
    const conn = await connect();
    const categories: any = await conn.query('SELECT * FROM categories');
    conn.end();

    return categories[0];
}


export async function CreateCategory(newCategory: Category){
    const conn = await connect();

    await conn.query('INSERT INTO categories SET ?', [newCategory]);
    conn.end();

    return 0;
}

export async function DeleteCategory(id: number | string){
    const conn = await connect();

    await conn.query('DELETE FROM categories WHERE categories.id =?', [id]);
    conn.end();

    return 0;
}

export async function UpdateCategory(updateCategory: Category, id: number | String){
    const conn = await connect();

    await conn.query('UPDATE categories SET ? WHERE categories.id = ?', [updateCategory, id]);
    conn.end();

    return 0;
}