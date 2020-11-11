import { Router } from 'express';
const router = Router();

// Middleware to validate the request
import { check } from 'express-validator';
import {verifyToken} from '../middleware/verifyToken';
import {checkAdmin} from '../middleware/checkAdmin';


// Controllers
import { getUsers, deleteUser, updateUser } from '../controllers/user.controller';

router.route('/')
    .get(verifyToken, checkAdmin, getUsers);

router.route('/:userId')
    .delete(verifyToken, checkAdmin, deleteUser)
    .put([
        check('password').optional().isLength({ min: 6 }).withMessage('You must enter a password with at least 6 digits'),
        check('email').optional().isEmail().withMessage('You must indicate a real email'),
        check('full_name').optional().isLength({ min: 1 }).withMessage('You must indicate your name'),
        check('dni').optional().isLength({ min: 3 }).withMessage('You must indicate your dni'),
        check('phone_number').optional().isLength({ min: 3 }).withMessage('You must indicate your phone number'),
        check('type_of_user').optional().isLength({ min: 5, max: 5 }).withMessage('Invalid Request'),
    ], verifyToken, updateUser);

export default router;