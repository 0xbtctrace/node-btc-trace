// library
import express from 'express';
// local
import { getBalanceByAddress } from '../services/wallet.js';

const router = express.Router();

// route the end points
router.route('/balance-by-address').get(getBalanceByAddress);

export default router;
