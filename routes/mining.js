// library
import express from 'express';
// local
import { getMiningInfo, getNetworkHashRate } from '../services/mining.js';

const router = express.Router();

// route the end points
router.route('/info').get(getMiningInfo);
router.route('/network-hashrate').get(getNetworkHashRate);

export default router;
