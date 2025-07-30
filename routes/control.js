// library
import express from 'express';
// local
import { getRpcInfo } from '../services/control.js';

const router = express.Router();

// route the end points
router.route('/rpc-info').get(getRpcInfo);

export default router;
