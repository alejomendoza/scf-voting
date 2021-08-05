import { Router } from 'tiny-request-router';
import votes from './votes';
import vote from './vote';
import approve from './approve';

export const router = new Router();
router.get('/votes', votes);
router.post('/vote', vote);
router.post('/approve', approve);
