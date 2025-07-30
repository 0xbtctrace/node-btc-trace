import Joi from 'joi';
import { getClient } from '../config/btcNodeConfig.js';
import expressAsyncHandler from 'express-async-handler';
import ApiError from '../errors/ApiError.js';
import HTTP_ERR_CODES from '../errors/httpErrorCodes.js';

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
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'request validation failed',
      error.details.map((d) => d.message)
    );
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

/**
 * @swagger
 * /blockchain/block/{blockhash}/filter:
 *   get:
 *     tags:
 *       - Blockchain
 *     summary: Retrieve a block filter using the `getblockfilter` RPC method
 *     description: |
 *       Returns a compact filter for a specified block. This is useful for light clients to filter relevant transactions.
 *       Currently, only the `basic` filter type is supported.
 *     parameters:
 *       - in: params
 *         name: blockhash
 *         required: true
 *         schema:
 *           type: string
 *         description: The hash of the block for which to retrieve the filter.
 *       - in: query
 *         name: filtertype
 *         required: false
 *         schema:
 *           type: string
 *           enum: [basic]
 *           default: basic
 *         description: The type of filter to retrieve. Only 'basic' is currently supported.
 *     responses:
 *       200:
 *         description: Successfully retrieved block filter
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
 *                   description: Block filter result from Bitcoin Core
 *                   example:
 *                     result:
 *                       filter: "01405c"
 *                       header: "142c3d..."
 *                     error: null
 *                     id: "curltest"
 *       400:
 *         description: Invalid or missing blockhash parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "`blockhash` query parameter is required and must be a string."
 */
export const getBlockFilter = expressAsyncHandler(async (req, res, next) => {
  const { query, params } = req;

  // validate with joi
  const schema = Joi.object({
    blockhash: Joi.string().length(64).required(),
    filtertype: Joi.string().valid('basic').default('basic'),
  });

  const { error, value } = schema.validate({
    ...query,
    ...params,
  });

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'Invalid request parameters',
      error.details.map((d) => d.message)
    );
  }
  const { blockhash, filtertype } = value;

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getblockfilter',
    params: [blockhash, filtertype],
  };

  const info = await getClient().post('/', payload);
  return res.status(200).json({ success: true, data: info.data });
});
