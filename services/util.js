import Joi from 'joi';
import { getClient } from '../config/btcNodeConfig.js';
import expressAsyncHandler from 'express-async-handler';
import ApiError from '../errors/ApiError.js';
import HTTP_ERR_CODES from '../errors/httpErrorCodes.js';
import { getHexSuffixDecimals } from '../utils/generals.js';

/**
 * @swagger
 * /util/create-multisig:
 *   post:
 *     tags:
 *     - Util API
 *     summary: Create a new P2SH multisig address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - n_required
 *               - keys
 *             properties:
 *               nRequired:
 *                 type: integer
 *                 example: 2
 *               keys:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["02b463...", "034fa9..."]
 *     responses:
 *       200:
 *         description: Multisig address and redeem script
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     redeemScript:
 *                       type: string
 *       400:
 *         description: Invalid input
 */
export const createMultisig = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;

  const schema = Joi.object({
    nRequired: Joi.number().integer().min(1).max(20).required(),
    keys: Joi.array()
      .items(Joi.string().pattern(/^([0-9a-fA-F]{66}|[0-9a-fA-F]{130})$/))
      .min(2)
      .max(20)
      .required(),
  });

  const { error, value } = schema.validate(body);

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'Request validation failed',
      error.details.map((d) => d.message)
    );
  }

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'createmultisig',
    params: [value.nRequired, value.keys],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /util/derive-addresses:
 *   post:
 *     tags:
 *     - Util API
 *     summary: Derive addresses from a descriptor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descriptor
 *             properties:
 *               descriptor:
 *                 type: string
 *                 example: "wpkh([d34db33f/84h/0h/0h]xpub6CUGRU...)"
 *               range:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 2
 *                 maxItems: 2
 *                 example: [0, 2]
 *     responses:
 *       200:
 *         description: Derived addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid input
 */
export const deriveAddresses = expressAsyncHandler(async (req, res, next) => {
  const schema = Joi.object({
    descriptor: Joi.string().required(),
    range: Joi.array()
      .items(Joi.number().integer().min(0))
      .length(2)
      .optional(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'Request validation failed',
      error.details.map((d) => d.message)
    );
  }

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'deriveaddresses',
    params: value.range ? [value.descriptor, value.range] : [value.descriptor],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /util/estimate-smart-fee:
 *   get:
 *     tags:
 *     - Util API
 *     summary: Estimate fee rate needed for confirmation within N blocks
 *     parameters:
 *       - in: query
 *         name: confTarget
 *         required: true
 *         schema:
 *           type: integer
 *           example: 6
 *         description: Target confirmation within how many blocks
 *       - in: query
 *         name: estimateMode
 *         required: false
 *         schema:
 *           type: string
 *           enum: [UNSET, ECONOMICAL, CONSERVATIVE]
 *           default: CONSERVATIVE
 *         description: Fee estimation strategy
 *     responses:
 *       200:
 *         description: Estimated fee rate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     feerate:
 *                       type: number
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Invalid parameters
 */
export const estimateSmartFee = expressAsyncHandler(async (req, res, next) => {
  const schema = Joi.object({
    confTarget: Joi.number().integer().min(1).required(),
    estimateMode: Joi.string()
      .valid('UNSET', 'ECONOMICAL', 'CONSERVATIVE')
      .default('CONSERVATIVE'),
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'Request validation failed',
      error.details.map((d) => d.message)
    );
  }

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'estimatesmartfee',
    params: [value.confTarget, value.estimateMode],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /util/get-descriptor-info:
 *   post:
 *     tags:
 *     - Util API
 *     summary: Get information (including checksum) for a descriptor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descriptor
 *             properties:
 *               descriptor:
 *                 type: string
 *                 example: "wpkh(xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKpD7.../0/*)"
 *     responses:
 *       200:
 *         description: Descriptor info and checksum
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid descriptor
 */
export const getDescriptorInfo = expressAsyncHandler(async (req, res, next) => {
  const schema = Joi.object({
    descriptor: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'Request validation failed',
      error.details.map((d) => d.message)
    );
  }

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getdescriptorinfo',
    params: [value.descriptor],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /util/index-info:
 *   get:
 *     tags:
 *     - Util API
 *     summary: Get status of enabled indexes (txindex, blockfilterindex, etc.)
 *     responses:
 *       200:
 *         description: Index info map
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       500:
 *         description: Internal server error
 */
export const getIndexInfo = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getindexinfo',
    params: [],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /util/validate-address:
 *   get:
 *     tags:
 *     - Util API
 *     summary: Validate a Bitcoin address and return address details
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *           example: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
 *         description: The Bitcoin address to validate
 *     responses:
 *       200:
 *         description: Validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid request
 */
export const validateAddress = expressAsyncHandler(async (req, res, next) => {
  const schema = Joi.object({
    address: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'Request validation failed',
      error.details.map((d) => d.message)
    );
  }

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'validateaddress',
    params: [value.address],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /util/verify-message:
 *   post:
 *     tags:
 *     - Util API
 *     summary: Verify that a signed message belongs to a Bitcoin address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - signature
 *               - message
 *             properties:
 *               address:
 *                 type: string
 *                 example: "1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs"
 *               signature:
 *                 type: string
 *                 example: "H+z5lzL8I3f6x6h7S4EOHHh7rqd6+R2c5bi33CFoR4MtP..."
 *               message:
 *                 type: string
 *                 example: "I am the rightful owner of this address."
 *     responses:
 *       200:
 *         description: Signature verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: boolean
 *       400:
 *         description: Invalid request or parameters
 */
export const verifyMessage = expressAsyncHandler(async (req, res, next) => {
  const schema = Joi.object({
    address: Joi.string().required(),
    signature: Joi.string().required(),
    message: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'Request validation failed',
      error.details.map((d) => d.message)
    );
  }

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'verifymessage',
    params: [value.address, value.signature, value.message],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /util/hash-to-decimal:
 *   get:
 *     tags:
 *     - Util API
 *     summary: Convert hash suffixes to decimal
 *     description: |
 *       Given a hexadecimal hash, this utility extracts the last 1 to 12 hex characters,
 *       returning both the hex and decimal values for each.
 *     parameters:
 *       - in: query
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *           example: "00000000000000000005a8b1937f5150ed17f7e89c99fc26d2ad7fe3c4d7c8f4"
 *         description: The full hexadecimal hash (e.g., a Bitcoin block hash)
 *     responses:
 *       200:
 *         description: Hex and decimal values from the last N hex characters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example:
 *                     last_1_hex:  { hex: "4", decimal: 4 }
 *                     last_2_hex:  { hex: "f4", decimal: 244 }
 *                     last_3_hex:  { hex: "8f4", decimal: 2292 }
 *                     last_4_hex:  { hex: "c8f4", decimal: 51444 }
 *                     last_5_hex:  { hex: "7c8f4", decimal: 510452 }
 *                     last_6_hex:  { hex: "d7c8f4", decimal: 14121300 }
 *                     last_7_hex:  { hex: "4d7c8f4", decimal: 81384756 }
 *                     last_8_hex:  { hex: "c4d7c8f4", decimal: 3303430644 }
 *                     last_9_hex:  { hex: "3c4d7c8f4", decimal: 25963064436 }
 *                     last_10_hex: { hex: "e3c4d7c8f4", decimal: 978541389556 }
 *                     last_11_hex: { hex: "fe3c4d7c8f4", decimal: 17475809133428 }
 *                     last_12_hex: { hex: "7fe3c4d7c8f4", decimal: 140676060755572 }
 *       400:
 *         description: Invalid or missing hash parameter
 */
export const getBlockHashDecimals = expressAsyncHandler(
  async (req, res, next) => {
    const schema = Joi.object({
      hash: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.query);

    if (error) {
      throw new ApiError(
        400,
        HTTP_ERR_CODES[400],
        'Request validation failed',
        error.details.map((d) => d.message)
      );
    }

    return res.status(200).json({
      success: true,
      data: getHexSuffixDecimals(value.hash),
    });
  }
);
