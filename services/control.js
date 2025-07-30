import Joi from 'joi';
import { getClient } from '../config/btcNodeConfig.js';
import expressAsyncHandler from 'express-async-handler';
import ApiError from '../errors/ApiError.js';
import HTTP_ERR_CODES from '../errors/httpErrorCodes.js';

/**
 * @swagger
 * /control/rpc-info:
 *   get:
 *     tags:
 *     - Control API
 *     summary: Get current active RPC command information
 *     responses:
 *       200:
 *         description: Active RPC command info
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
export const getRpcInfo = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getrpcinfo',
    params: [],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});
