// Connection to the database
import { connect } from '../database';

// Interface 
import { Order } from '../interface/Order';


export async function SelectOrderById(id: number | String){   
    const conn = await connect();
    const order: any = await conn.query('SELECT * FROM orders WHERE id = ?', [id]);
    conn.end();

    return order[0][0];
}

export async function SelectOrders(){   
    const conn = await connect();
    const orders: any = await conn.query('SELECT * FROM orders');
    conn.end();

    return orders[0];
}

export async function SelectActiveOrderByUser(userId: number | String){   
    const conn = await connect();
    const order: any = await conn.query('SELECT * FROM orders WHERE orders.user_id =? AND orders.status ="active"', [userId]);
    conn.end();

    return order[0][0];
}

export async function SelectOrderByUserAndId(userId: number | String, orderId: number | String){   
    const conn = await connect();
    const order: any = await conn.query('SELECT * FROM orders WHERE orders.user_id =? AND orders.id =?', [userId, orderId]);
    conn.end();

    return order[0][0];
}

export async function CreateOrder(newOrder: Order){
    const conn = await connect();

    await conn.query('INSERT INTO orders SET ?', [newOrder]);
    conn.end();

    return 0;
}

export async function DeleteOrder(userId: number | string, orderId: number | String){
    const conn = await connect();

    await conn.query('DELETE FROM orders WHERE orders.user_id =? AND orders.id =?', [userId, orderId]);   
    conn.end();

    return 0;
}

export async function UpdateOrder(updateOrder: Order, userId: number | string, orderId: number | String){
    const conn = await connect();

    await conn.query('UPDATE orders SET ? WHERE orders.user_id =? AND orders.id =?', [updateOrder, userId, orderId]);
    conn.end();

    return 0;
}