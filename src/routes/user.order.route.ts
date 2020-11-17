import { Router } from 'express';
const router = Router();

// Middleware to validate the request
import { check } from 'express-validator';
import {verifyToken} from '../middleware/verifyToken';
import {checkOwner} from '../middleware/checkIfUserIsOwner';

// Controllers
import { getOrderFromUser, createOrder, deleteOrder, updateAnOrder } from '../controllers/order.controller';

router.route('/:userId/orders')
    .get(verifyToken, checkOwner, getOrderFromUser)
    .post(verifyToken, checkOwner, createOrder);

router.route('/:userId/orders/:orderId')
    .delete(verifyToken, checkOwner, deleteOrder)
    .put([
        check('payment_type').optional().isIn(['cash', 'transfer', 'card']).withMessage('You must indicate a payment type'),
        check('delivery_method').optional().isIn(['delivery', 'pickUp']).withMessage('You must indicate a delivery method'),
        check('commentary').optional().isLength({ min: 1 }).withMessage('You must indicate a commentary'),
        check('address_id').optional().isLength({ min: 1 }).withMessage('You must indicate an addressID'),
        check('id').optional().not().exists().withMessage('Invalid request'),
        check('user_id').optional().not().exists().withMessage('Invalid request')
    ], verifyToken, checkOwner, updateAnOrder);

export default router;