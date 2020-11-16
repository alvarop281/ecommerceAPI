import { Router } from 'express';
const router = Router();

// Middleware to validate the request
import { body } from 'express-validator';
import { verifyToken } from '../middleware/verifyToken';
import { checkOwnerOrder } from '../middleware/chechIfTheUserOwnsTheOrder';
import { DetailBelongsOrder } from '../middleware/checkDetailBelongsToOrder';

// Controllers
import { getDetails, createDetails, deleteDetails, updateDetails } from '../controllers/detail.controller';

router.route('/:orderId/details')
    .get(verifyToken, checkOwnerOrder, getDetails)
    .post([
        body('ordered_quantity').isInt({ min: 1 }).withMessage('You must indicate a quantity'),
        body('product_id').isInt({ min: 1 }).withMessage('You must indicate a valid product'),
        body('unit_price').optional().not().exists().withMessage('Invalid request'),
        body('total_by_product').optional().not().exists().withMessage('Invalid request'),
        body('order_id').optional().not().exists().withMessage('Invalid request')
    ], verifyToken, checkOwnerOrder, createDetails);

router.route('/:orderId/details/:detailId')
    .delete(verifyToken, checkOwnerOrder, DetailBelongsOrder, deleteDetails)
    .put([
        body('ordered_quantity').isInt({ min: 1 }).withMessage('You must indicate a quantity'),
        body('product_id').optional().not().exists().withMessage('Invalid request'),
        body('unit_price').optional().not().exists().withMessage('Invalid request'),
        body('total_by_product').optional().not().exists().withMessage('Invalid request'),
        body('order_id').optional().not().exists().withMessage('Invalid request')
    ],verifyToken, checkOwnerOrder, DetailBelongsOrder, updateDetails);

export default router;