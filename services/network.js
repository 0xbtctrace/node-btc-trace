import Joi from 'joi';
import { getClient } from '../config/btcNodeConfig.js';
import expressAsyncHandler from 'express-async-handler';
import ApiError from '../errors/ApiError.js';
import HTTP_ERR_CODES from '../errors/httpErrorCodes.js';

/**
 * @swagger
 * /network/connection-count:
 *   get:
 *     tags:
 *     - Network API
 *     summary: Get the number of connections to other nodes
 *     responses:
 *       200:
 *         description: Connection count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
export const getConnectionCount = expressAsyncHandler(
  async (req, res, next) => {
    const payload = {
      jsonrpc: '1.0',
      id: 'curltest',
      method: 'getconnectioncount',
      params: [],
    };

    const info = await getClient().post('/', payload);

    return res.status(200).json({
      success: true,
      data: info.data.result,
    });
  }
);

/**
 * @swagger
 * /network/net-totals:
 *   get:
 *     tags:
 *     - Network API
 *     summary: Get network traffic totals
 *     responses:
 *       200:
 *         description: Net totals info
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
export const getNetTotals = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getnettotals',
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
 * /network/info:
 *   get:
 *     tags:
 *     - Network API
 *     summary: Get general network information
 *     responses:
 *       200:
 *         description: Network info
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
export const getNetworkInfo = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getnetworkinfo',
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
 * /network/peers:
 *   get:
 *     tags:
 *     - Network API
 *     summary: Get info about connected peers
 *     responses:
 *       200:
 *         description: Peer info
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
 *                     type: object
 *       500:
 *         description: Internal server error
 */
export const getPeerInfo = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getpeerinfo',
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
 * /network/node-addresses:
 *   get:
 *     tags:
 *     - Network API
 *     summary: Get known addresses that this node has seen
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of node addresses to return (max 1000)
 *     responses:
 *       200:
 *         description: Known node addresses
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
 *                     type: object
 *       400:
 *         description: Invalid parameter
 */
export const getNodeAddresses = expressAsyncHandler(async (req, res, next) => {
  const { count = 10 } = req.query;

  const schema = Joi.object({
    count: Joi.number().integer().min(1).max(1000).default(10),
  });

  const { error, value } = schema.validate({ count });

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'request validation failed',
      error.details.map((d) => d.message)
    );
  }

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getnodeaddresses',
    params: [value.count],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});
