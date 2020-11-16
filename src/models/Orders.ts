// Connection to the database
import { connect } from '../database';

export async function SelectOrderById(id: number | String){   
    const conn = await connect();
    const order: any = await conn.query('SELECT * FROM orders WHERE id = ?', [id]);
    conn.end();

    return order[0][0];
}