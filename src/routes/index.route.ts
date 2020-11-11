import { Router } from 'express';
const router = Router();

// Controllers
import { IndexWelcome } from '../controllers/index.controller';

router.route('/')
    .get(IndexWelcome);

export default router;