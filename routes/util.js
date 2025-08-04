// library
import express from 'express';
// local
import {
  createMultisig,
  deriveAddresses,
  estimateSmartFee,
  getDescriptorInfo,
  getIndexInfo,
  validateAddress,
  verifyMessage,
} from '../services/util.js';

const router = express.Router();

// route the end points
router.route('/create-multisig').post(createMultisig);
router.route('/derive-address').post(deriveAddresses);
router.route('/estimate-smart-fee').get(estimateSmartFee);
router.route('/estimate-smart-fee').get(estimateSmartFee);
router.post('/get-descriptor-info', getDescriptorInfo);
router.get('/index-info', getIndexInfo);
router.get('/validate-address', validateAddress);
router.post('/verify-address', verifyMessage);

export default router;
