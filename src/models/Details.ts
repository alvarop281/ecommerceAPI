// Connection to the database
import { connect } from '../database';

import { Detail } from '../interface/Detail';

export async function SelectDetailsById(id: number | String){   
    const conn = await connect();
    const detail: any = await conn.query('SELECT * FROM details WHERE id = ?', [id]);
    conn.end();

    return detail[0][0];
}

export async function SelectDetailsByOrderId(id: number | String){   
    const conn = await connect();
    const detail: any = await conn.query('SELECT * FROM details WHERE order_id = ?', [id]);
    conn.end();

    return detail[0];
}

export async function SelectDetailsByProductOrder(OrderId: number | String, ProductId: number | String){   
    const conn = await connect();
    const detail: any = await conn.query('SELECT * FROM details WHERE order_id = ? AND product_id =?', [OrderId, ProductId]);
    conn.end();

    return detail[0][0];
}

export async function CreateDetail(detail: Detail){
    const conn = await connect();
    await conn.query('INSERT INTO details SET ?', [detail]);
    conn.end();
        
    return 0;
}

export async function DeleteDetail(id: number | String){
    const conn = await connect();
    await conn.query('DELETE FROM details WHERE id = ?', [id]);
    conn.end();
        
    return 0;
}

export async function UpdateDetail(id: number | String, detail: Detail){
    const conn = await connect();
    await conn.query('UPDATE details SET ? WHERE details.id = ?', [detail, id]);
    conn.end();
        
    return 0;
}