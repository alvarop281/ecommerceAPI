import {Request, Response} from 'express';

// Interface Orders
import { Order } from '../interface/Order';

// Model
import {SelectOrders, 
        SelectActiveOrderByUser, 
        SelectOrderByUserAndId, 
        CreateOrder, 
        DeleteOrder, 
        UpdateOrder} from '../models/Orders';

// Get all orders
export async function getOrders(req: Request, res: Response): Promise<Response>{
    const orders: Order = await SelectOrders()
    return res.json(orders);
}

// Get a order from order
export async function getOrderFromUser(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userId = req.params.userId;

    const orders: Order = await SelectActiveOrderByUser(userId);

    return res.json(orders);
}

// create a order
export async function createOrder(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userId = req.params.userId;
    const orders: Order = await SelectActiveOrderByUser(userId);
        
    try{
        if(orders.status === 'active'){
            return res.json({
                message: "You have an active order",
                orders
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
    await CreateOrder(newOrder);
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
    
     //Validate status order
    const order: Order = await SelectOrderByUserAndId(userId, orderId);
    if(order.status !== 'active') return res.status(400).json({ message: 'Cannot delete a processed order'}); 

    await DeleteOrder(userId, orderId);    

    // Success Response
    return res.json({
        message: "Order Deteted"
    });
}

// Update a Order from a user
export async function updateAnOrder(req: Request, res: Response): Promise<Response>{
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

    await UpdateOrder(updateOrder, userId, orderId);

    // Response
    return res.json({
        message: 'Order Updated'
    });
}