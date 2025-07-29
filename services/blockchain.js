import Joi from 'joi';
import { getClient } from '../config/btcNodeConfig.js';
import expressAsyncHandler from 'express-async-handler';

/**
 * @swagger
 * /blockchain/info:
 *   get:
 *     tags:
 *     - Blockchain
 *     summary: Get current Bitcoin chain tip info
 *     responses:
 *       200:
 *         description: Bitcoin chain info
 */
export const getChainInfo = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getblockchaininfo',
    params: [],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data,
  });
});

/**
 * @swagger
 * /blockchain/best-block-hash:
 *   get:
 *     tags:
 *     - Blockchain
 *     summary: Call Bitcoin RPC method `getbestblockhash`
 *     responses:
 *       200:
 *         description: Bitcoin getbestblockhash result
 */
export const getGetBestblockhash = expressAsyncHandler(
  async (req, res, next) => {
    const payload = {
      jsonrpc: '1.0',
      id: 'curltest',
      method: 'getbestblockhash',
      params: [],
    };

    const info = await getClient().post('/', payload);
    return res.status(200).json({ success: true, data: info.data });
  }
);

/**
 * @swagger
 * /blockchain/block/{blockhash}:
 *   get:
 *     tags:
 *     - Blockchain
 *     summary: Get block details by hash
 *     parameters:
 *       - in: path
 *         name: blockhash
 *         schema:
 *           type: string
 *           example:
 *         required: true
 *         description: The block hash (64-character hex)
 *       - in: query
 *         name: verbosity
 *         schema:
 *           type: integer
 *           enum: [0, 1, 2]
 *           default: 1
 *         required: false
 *         description: Verbosity level (0 = hex, 1 = JSON object, 2 = JSON with tx details)
 *     responses:
 *       200:
 *         description: Block data
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
 *         description: Invalid parameters
 */
export const getBlock = expressAsyncHandler(async (req, res, next) => {
  const { params, query } = req;

  const getBlockSchema = Joi.object({
    blockhash: Joi.string().length(64).required(),
    verbosity: Joi.number().valid(0, 1, 2).optional(),
  });

  const { error, value } = getBlockSchema.validate({ ...params, ...query });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request parameters',
      details: error.details.map((d) => d.message),
    });
  }

  const { blockhash, verbosity = 1 } = value;

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getblock',
    params: [blockhash, verbosity],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /blockchain/block-count:
 *   get:
 *     tags:
 *     - Blockchain
 *     summary: Get current Bitcoin block count
 *     responses:
 *       200:
 *         description: Returns the total number of blocks in the chain
 */
export const getBlockCount = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getblockcount',
    params: [],
  };

  const result = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: result.data.result,
  });
});
