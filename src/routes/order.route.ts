import { Router } from 'express';
const router = Router();

// Middleware to validate the request
import {verifyToken} from '../middleware/verifyToken';
import {checkAdmin} from '../middleware/checkAdmin';

// Controllers
import { getOrders } from '../controllers/order.controller';

router.route('/')
    .get(verifyToken, checkAdmin, getOrders);


export default router;