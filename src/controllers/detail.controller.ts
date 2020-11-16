import {Request, Response} from 'express';

// Interface Details
import { Detail } from '../interface/Detail';

// Models
import {SelectDetailsByOrderId, SelectDetailsByProductOrder, CreateDetail, SelectDetailsById, DeleteDetail, UpdateDetail} from '../models/Details';
import { SelectProductByID, updateToDeleteDetail, updateQuantity } from '../models/Products';

// Get all Details from a order
export async function getDetails(req: Request, res: Response): Promise<Response>{
    const id = req.params.orderId;
    
    // Details Model 
    const detail = await SelectDetailsByOrderId(id);
    return res.json(detail);
}

// create a new detail
export async function createDetails(req: Request, res: Response): Promise <Response>{
    // Save data
    const orderId = req.params.orderId;
    const productId = req.body.product_id;
    const orderedQuantity = req.body.ordered_quantity;

    // Verify the existence of the product
    const product = await SelectProductByID(productId);
    try{
        if(product === undefined) return res.status(404).json({message: 'The product does not exist'});
    }catch{}

    // Verify that the existence of the product does not exceed what is requested
    if(orderedQuantity > product['quantity'] || product['status'] !== 'active') {
        return res.status(404).json({message: 'Product not avilable'});
    }

    // The product must not exist for the order
    const detail = await SelectDetailsByProductOrder(orderId, productId);
    try{
        if(detail['order_id'] == orderId ) return res.status(404).json({message: 'The product already exists'});
    }catch{}

    // If the above conditions are met, the detail can be created
    const totalByProduct = product['price'] * orderedQuantity;
    const newDetail: Detail = {
        ordered_quantity: orderedQuantity,
        unit_price: product['price'],
        total_by_product: totalByProduct,
        product_id: productId,
        order_id: orderId
    }

    const productQuantity = product['quantity'] - orderedQuantity;

    await updateQuantity(productId, productQuantity)
    await CreateDetail(newDetail);

    // Response
    return res.json({
        message: 'Detail Created'
    });
}

export async function deleteDetails(req: Request, res: Response): Promise<Response>{
    const orderId = req.params.orderId;
    const detailId = req.params.detailId;

    const detail = await SelectDetailsById(detailId);

    const orderedQuantity = detail['ordered_quantity'];
    const productId = detail['product_id'];

    await updateToDeleteDetail(productId, orderedQuantity);
    await DeleteDetail(detailId);

    // Response
    return res.json({
        message: 'Detail Deleted'
    });
}


export async function updateDetails(req: Request, res: Response): Promise<Response>{
    const orderId = req.params.orderId;
    const detailId = req.params.detailId;
    const orderedQuantity = req.body.ordered_quantity;

    const detail = await SelectDetailsById(detailId);
    const product = await SelectProductByID(detail['product_id'])
    // Maximum quantity to order
    const maximumQuantityToOrder = detail['ordered_quantity'] + product['quantity'];

    // Verify that the existence of the product does not exceed what is requested
    if(orderedQuantity > maximumQuantityToOrder) return res.status(404).json({message: 'The requested quantity is greater than the stock'});

    const productQuantity = maximumQuantityToOrder - orderedQuantity;

    detail['unit_price'] = product['price'];
    detail['total_by_product'] = product['price'] * orderedQuantity;
    detail['ordered_quantity'] = orderedQuantity;

    await updateQuantity(product['id'], productQuantity);
    await UpdateDetail(detailId, detail);

    // Response
      return res.json({
        message: 'Detail Deleted'
    });
}

