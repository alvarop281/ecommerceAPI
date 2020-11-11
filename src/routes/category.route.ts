import { Router } from 'express';
const router = Router();

// Validator
import {body} from 'express-validator';

// Middleware
import { verifyToken } from '../middleware/verifyToken';
import {checkAdmin} from '../middleware/checkAdmin';

// Category Controller
import { getCategories, createCategory, getCategory, deleteCategory, updateCategory } from '../controllers/category.controllers';
// Items Constroller
import { getItemFromCategory } from '../controllers/item.controller';

router.route('/')
    .get(getCategories)
    .post([
        body('description').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('background').isLength({ min: 2 }).withMessage('must be at least 2 chars long')
    ], verifyToken, checkAdmin, createCategory);

router.route('/:categoryId')
    .get(getCategory)
    .delete(verifyToken, checkAdmin, deleteCategory)
    .put([
        body('description').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('background').isLength({ min: 2 }).withMessage('must be at least 2 chars long')
    ], verifyToken, checkAdmin, updateCategory);

router.route('/:categoryId/items')
    .get(getItemFromCategory);

export default router;