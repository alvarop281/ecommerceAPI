import {Request, Response} from 'express';

// Middleware to Validate the reques
import {validationResult} from 'express-validator';

// Connection to the database
import { connect } from '../database';

// Interface Orders
import { Order } from '../interface/Order';

// Get all orders
export async function getOrders(req: Request, res: Response): Promise<Response>{
    const conn = await connect();
    const orders = await conn.query('SELECT * FROM orders');
    return res.json(orders[0]);
}

// Get a order from order
export async function getOrderFromUser(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userId = req.params.userId;

    const conn = await connect();
    const orders = await conn.query('SELECT * FROM orders WHERE orders.user_id =? AND orders.status ="active"', [userId]);

    return res.json(orders[0]);
}

// create a order
export async function createOrder(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userId = req.params.userId;
    
    const conn = await connect();
    const orders: any = await conn.query('SELECT * FROM orders WHERE orders.user_id =? AND orders.status ="active"', [userId]);

    try{
        if(orders[0][0].status === 'active'){
            return res.json({
                message: "You have an active order",
                order: orders[0][0]
            });
        }
    } catch {}

    // Settigns
    const newOrder: Order = req.body;
    newOrder['status'] = 'active';          //Default value
    newOrder['payment_type'] = '';          //Default value
    newOrder['proof_of_payment'] = '';      //Default value
    newOrder['delivery_method'] = '';       //Default value
    newOrder['commentary'] = '';            //Default value
    newOrder['address_id'] = '';            //Default value
    newOrder['user_id'] = userId;           //Default value

    // Create
    await conn.query('INSERT INTO orders SET ?', [newOrder]);

    // Success Response
    return res.json({
        message: "Order Created"
    });
    
}

// create a order
export async function deleteOrder(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    
    const conn = await connect();
    await conn.query('DELETE FROM orders WHERE orders.user_id =? AND orders.id =?', [userId, orderId]);    

    // Success Response
    return res.json({
        message: "Order Deteted"
    });
}

// Update a Order from a user
export async function UpdateOrder(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    const updateOrder: Order = req.body;

    // Connection to db
    const conn = await connect();
    await conn.query('UPDATE orders SET ? WHERE orders.user_id =? AND orders.id =?', [updateOrder, userId, orderId]);

    // Response
    return res.json({
        message: 'Order Updated'
    });
}