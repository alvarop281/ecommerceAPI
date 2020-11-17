import {Request, Response} from 'express';

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
    newOrder['status'] = 'active';              //Default value
    newOrder['payment_type'] = 'standby';       //Default value
    newOrder['proof_of_payment'] = 'standby';   //Default value
    newOrder['delivery_method'] = 'standby';    //Default value
    newOrder['commentary'] = 'standby';         //Default value
    newOrder['address_id'] = '';                //Default value
    newOrder['user_id'] = userId;               //Default value

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

    //Validate status order
    const order: any = await conn.query('SELECT * FROM orders WHERE orders.user_id =? AND orders.id =?', [userId, orderId]);
    if(order[0][0].status !== 'active') return res.status(400).json({ message: 'Cannot delete a processed order'}); 

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

    // Save and store image
    if(req.files){
        const image = req.files.proof_of_payment;

        updateOrder['proof_of_payment'] = userId + '-' + orderId + '-' + image.name;

        // Validate the file type
        if(image.mimetype !== 'image/png' && image.mimetype !== 'image/jpg'){
            return res.status(400).json({ errors: 'The file type is invalid' });
        }

        // Store file
        image.mv('./uploads/proof/' + userId + '-' + orderId + '-' + image.name, function (error){
            if(error){
                return res.status(400).json({ error });
            }
        });
    }
    updateOrder['status'] = 'in process';

    // Connection to db
    const conn = await connect();
    await conn.query('UPDATE orders SET ? WHERE orders.user_id =? AND orders.id =?', [updateOrder, userId, orderId]);
    await conn.end();

    // Response
    return res.json({
        message: 'Order Updated'
    });
}