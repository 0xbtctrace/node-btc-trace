import { getClient } from '../config/btcNodeConfig.js';
import expressAsyncHandler from 'express-async-handler';

/**
 * @swagger
 * /mining/info:
 *   get:
 *     tags:
 *     - Mining API
 *     summary: Get mining-related info (difficulty, hashrate, etc.)
 *     responses:
 *       200:
 *         description: Mining info data
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
export const getMiningInfo = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getmininginfo',
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
 * /mining/network-hashrate:
 *   get:
 *     tags:
 *     - Mining API
 *     summary: Get estimated network hash rate
 *     responses:
 *       200:
 *         description: Estimated hash rate info
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
export const getNetworkHashRate = expressAsyncHandler(
  async (req, res, next) => {
    const payload = {
      jsonrpc: '1.0',
      id: 'curltest',
      method: 'getnetworkhashps',
      params: [],
    };

    const info = await getClient().post('/', payload);

    return res.status(200).json({
      success: true,
      data: info.data.result,
    });
  }
);
