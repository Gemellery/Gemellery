import { Router } from 'express';
import { sendContactMessage } from '../controllers/contactController';

const router = Router();

// POST /api/contact
router.post('/', sendContactMessage);

export default router;