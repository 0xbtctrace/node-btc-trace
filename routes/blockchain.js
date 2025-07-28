// library
import express from 'express';
// local
import {
  getChainInfo,
  getGetBestblockhash,
  getBlock,
  getBlockCount,
} from '../services/blockchain.js';

const router = express.Router();

// route the end points
router.route('/info').get(getChainInfo);
router.route('/best-block-hash').get(getGetBestblockhash);
router.route('/block/:blockhash').get(getBlock);
router.route('/block-count').get(getBlockCount);

export default router;
