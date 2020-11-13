import { Router } from 'express';
const router = Router();

// Middleware to validate the request
import { check } from 'express-validator';
import {verifyToken} from '../middleware/verifyToken';
import {checkOwner} from '../middleware/checkIfUserIsOwner';

import { getAllFromUser, createAddress, getAddressFromUser, deleteAddressFromUser, UpdateAddressFromUser } from '../controllers/address.controller';

router.route('/:userId/addresses/')
    .get(verifyToken, checkOwner, getAllFromUser)
    .post(verifyToken, [
        check('address').isLength({ min: 1 }).withMessage('You must indicate your addres'),
        check('reference').optional().isLength({ min: 1 }).withMessage('You must indicate a reference'),
        check('id').optional().not().exists().withMessage('Invalid request'),
        check('user_id').optional().not().exists().withMessage('Invalid request'),
    ], checkOwner, createAddress);

router.route('/:userId/addresses/:addressId')
    .get(verifyToken, checkOwner, getAddressFromUser)
    .delete(verifyToken, checkOwner, deleteAddressFromUser)
    .put(verifyToken, [
        check('id').optional().not().exists().withMessage('Invalid request'),
        check('user_id').optional().not().exists().withMessage('Invalid request'),
        check('address').isLength({ min: 1 }).withMessage('You must indicate your addres'),
        check('reference').optional().isLength({ min: 1 }).withMessage('You must indicate a reference')
    ], checkOwner, UpdateAddressFromUser);

export default router;