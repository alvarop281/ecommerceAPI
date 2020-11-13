import { Router } from 'express';
const router = Router();

// Middleware to validate the request
import { body } from 'express-validator';
import {verifyToken} from '../middleware/verifyToken';
import {checkAdmin} from '../middleware/checkAdmin';

// Controllers
import { getItems, createItem, getItem, deleteItem, updateItem } from '../controllers/item.controller';
import { getProductFromItems } from '../controllers/product.controller';


router.route('/')
    .get(getItems)
    .post([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('category_id').optional().not().exists().withMessage('Invalid request'),
        body('title').isLength({ min: 1 }).withMessage('You must indicate a title'),
        body('category_id').isInt().withMessage('Invalid request'),
    ], verifyToken, checkAdmin, createItem);

router.route('/:itemId')
    .get(getItem)
    .delete(verifyToken, checkAdmin, deleteItem)
    .put([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('category_id').optional().not().exists().withMessage('Invalid request'),
        body('title').isLength({ min: 1 }).withMessage('You must indicate a title'),
        body('category_id').isInt().withMessage('Invalid request'),
    ], verifyToken, checkAdmin, updateItem);

router.route('/:itemId/products')
    .get(getProductFromItems);

export default router;