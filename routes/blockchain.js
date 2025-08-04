// library
import express from 'express';
// local
import {
  getChainInfo,
  getGetBestblockhash,
  getBlock,
  getBlockCount,
  getBlockHeader,
  getBlockStats,
  getBlockHash,
  getChainTips,
  getChainTxStats,
  getDifficulty,
  getMempoolAncestors,
  getMempoolDescendants,
  getMempoolEntry,
  getMempoolInfo,
  getRawMempool,
  getTxOut,
  getTxOutProof,
  scanUTXOSet,
  verifyTxOutProof,
  getBlockHashDecimals,
} from '../services/blockchain.js';

const router = express.Router();

// route the end points
router.route('/info').get(getChainInfo);
router.route('/best-block-hash').get(getGetBestblockhash);
router.route('/block-count').get(getBlockCount);
router.route('/block/:blockhash').get(getBlock);
router.route('/blockhash/:count').get(getBlockHash);
router.route('/block-hash-decimals/:height').get(getBlockHashDecimals);
router.route('/block-header/:blockhash').get(getBlockHeader);
router.route('/block-stats/:height').get(getBlockStats);
router.route('/chain-tips').get(getChainTips);
router.route('/chain-tx-stats').get(getChainTxStats);
router.route('/difficulty').get(getDifficulty);
router.route('/mempool/ancestors/:txid').get(getMempoolAncestors);
router.route('/mempool/descendants/:txid').get(getMempoolDescendants);
router.route('/mempool/entry/:txid').get(getMempoolEntry);
router.route('/mempool/info').get(getMempoolInfo);
router.route('/mempool/raw').get(getRawMempool);
router.route('/txout/:txid/:index').get(getTxOut);
router.route('/txout-proof/:txid').get(getTxOutProof);
router.route('/scan-utxos').post(scanUTXOSet);
router.route('/verify-txout-proof').post(verifyTxOutProof);

export default router;
