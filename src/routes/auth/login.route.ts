import { Router } from 'express';
const router = Router();

// Middleware to validate the request
import { body } from 'express-validator';
import {verifyToken} from '../../middleware/verifyToken';

// Controllers
import { login, signin, profile } from '../../controllers/auth.controller';

router.route('/login/')
    .post([
        body('email').isEmail().withMessage('You must indicate a real email'),
        body('password').isLength({ min: 6 }).withMessage('Invalid email and password!')
    ], login);
router.route('/sigin/')
    .post([
        body('email').isEmail().withMessage('You must indicate a real email'),
        body('password').isLength({ min: 6 }).withMessage('You must enter a password with at least 6 digits'),
        body('full_name').isLength({ min: 1 }).withMessage('You must indicate your name'),
    ], signin);

router.route('/profile/')
    .get(verifyToken, profile)

export default router;