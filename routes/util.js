// library
import express from 'express';
// local
import {
  createMultisig,
  deriveAddresses,
  estimateSmartFee,
  getBlockHashDecimals,
  getDescriptorInfo,
  getIndexInfo,
  validateAddress,
  verifyMessage,
} from '../services/util.js';

const router = express.Router();

// route the end points
router.get('/estimate-smart-fee', estimateSmartFee);
router.get('/estimate-smart-fee', estimateSmartFee);
router.get('/index-info', getIndexInfo);
router.get('/validate-address', validateAddress);
router.get('/hash-to-decimal', getBlockHashDecimals);
router.post('/get-descriptor-info', getDescriptorInfo);
router.post('/create-multisig', createMultisig);
router.post('/derive-address', deriveAddresses);
router.post('/verify-address', verifyMessage);

export default router;
