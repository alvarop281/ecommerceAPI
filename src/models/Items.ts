// Connection to the database
import { connect } from '../database';
import { Item } from '../interface/Item';

export async function SelectItemByID(id: number | String){   
    const conn = await connect();
    const item: any = await conn.query('SELECT * FROM items WHERE items.id =?', [id]);
    conn.end();

    return item[0][0];
}

export async function SelectItems(){   
    const conn = await connect();
    const items: any = await conn.query('SELECT * FROM items');
    conn.end();

    return items[0];
}

export async function SelectItemByCategory(id: number | String){   
    const conn = await connect();
    const item: any = await conn.query('SELECT * FROM items WHERE items.category_id =?', [id]);
    conn.end();

    return item[0];
}


export async function CreateItem(newItem: Item){
    const conn = await connect();

    await conn.query('INSERT INTO items SET ?', [newItem]);
    conn.end();

    return 0;
}

export async function DeleteItem(id: number | string){
    const conn = await connect();

    await conn.query('DELETE FROM items WHERE items.id =?', [id]);
    conn.end();

    return 0;
}

export async function UpdateItem(updateItem: Item, id: number | String){
    const conn = await connect();

    await conn.query('UPDATE items SET ? WHERE items.id = ?', [updateItem, id]);
    conn.end();

    return 0;
}