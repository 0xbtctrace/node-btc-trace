// library
import express from 'express';
// local
import {
  getConnectionCount,
  getNetTotals,
  getNetworkInfo,
  getNodeAddresses,
  getPeerInfo,
} from '../services/network.js';

const router = express.Router();

// route the end points
router.route('/info').get(getNetworkInfo);
router.route('/connection-count').get(getConnectionCount);
router.route('/net-totals').get(getNetTotals);
router.route('/peer-info').get(getPeerInfo);
router.route('/node-addresses').get(getNodeAddresses);

export default router;
