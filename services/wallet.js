import Joi from 'joi';
import { getClient } from '../config/btcNodeConfig.js';
import expressAsyncHandler from 'express-async-handler';
import ApiError from '../errors/ApiError.js';
import HTTP_ERR_CODES from '../errors/httpErrorCodes.js';

/**
 * @swagger
 * /wallet/get-balance-by-address:
 *   get:
 *     tags:
 *     - Wallet API
 *     summary: Get total balance (UTXO) for a public Bitcoin address using scantxoutset
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *           example: "1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs"
 *         description: A valid Bitcoin address
 *     responses:
 *       200:
 *         description: Current UTXO balance for the address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 balance:
 *                   type: number
 *       400:
 *         description: Invalid address or bad input
 */
export const getBalanceByAddress = expressAsyncHandler(
  async (req, res, next) => {
    const schema = Joi.object({
      address: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.query);

    if (error) {
      throw new ApiError(
        400,
        HTTP_ERR_CODES[400],
        'Validation failed',
        error.details.map((d) => d.message)
      );
    }

    const payload = {
      jsonrpc: '1.0',
      id: 'curltest',
      method: 'scantxoutset',
      params: ['start', [{ desc: `addr(${value.address})` }]],
    };

    const info = await getClient().post('/', payload);
    const result = info.data.result;

    return res.status(200).json({
      success: true,
      data: result?.total_amount ?? 0,
    });
  }
);
