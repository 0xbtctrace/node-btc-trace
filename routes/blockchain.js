// library
import express from 'express';
// local
import {
  getChainInfo,
  getGetBestblockhash,
  getBlock,
  getBlockCount,
  getBlockFilter,
} from '../services/blockchain.js';

const router = express.Router();

// route the end points
router.route('/info').get(getChainInfo);
router.route('/best-block-hash').get(getGetBestblockhash);
router.route('/block-count').get(getBlockCount);
router.route('/block/:blockhash').get(getBlock);
router.route('/block/:blockhash/filter').get(getBlockFilter);

export default router;
