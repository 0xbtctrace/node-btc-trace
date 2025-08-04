import Joi from 'joi';
import { getClient } from '../config/btcNodeConfig.js';
import expressAsyncHandler from 'express-async-handler';
import ApiError from '../errors/ApiError.js';
import HTTP_ERR_CODES from '../errors/httpErrorCodes.js';
import { getHexSuffixDecimals } from '../utils/generals.js';

/**
 * @swagger
 * /blockchain/info:
 *   get:
 *     tags:
 *     - Blockchain API
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
 *     - Blockchain API
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
 *     - Blockchain API
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
 *     - Blockchain API
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
 * /blockchain/blockhash/{count}:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get block hash by block height
 *     parameters:
 *       - in: path
 *         name: count
 *         schema:
 *           type: integer
 *         required: true
 *         description: The block height to retrieve the hash for
 *     responses:
 *       200:
 *         description: Block hash result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: string
 *                   example: "00000000000000000001a63c..."
 *       400:
 *         description: Invalid block height
 */
export const getBlockHash = expressAsyncHandler(async (req, res, next) => {
  const { count } = req.params;

  const schema = Joi.object({
    count: Joi.number().integer().min(0).required(),
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
    method: 'getblockhash',
    params: [Number(value.count)],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /blockchain/block-hash-decimals/{height}:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get block hash and decimal suffixes by block height
 *     description: Retrieve the Bitcoin block hash for a given block height, and return its decimal equivalents for the last 1–16 hex digits (up to 64-bit values).
 *     parameters:
 *       - in: path
 *         name: height
 *         schema:
 *           type: integer
 *           minimum: 0
 *         required: true
 *         description: The block height to retrieve the hash for
 *     responses:
 *       200:
 *         description: Block hash and decimal values
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
 *                   properties:
 *                     hash:
 *                       type: string
 *                       example: "00000000000000000005a8b1937f5150ed17f7e89c99fc26d2ad7fe3c4d7c8f4"
 *                     decimals:
 *                       type: object
 *                       example:
 *                         0_15: "4"
 *                         0_255: "244"
 *                         0_4095: "2292"
 *                         0_65535: "31860"
 *                         0_1048575: "254100"
 *                         0_16777215: "263716"
 *                         0_268435455: "15473860"
 *                         0_4294967295: "79883724"
 *                         0_68719476735: "272204631"
 *                         0_1099511627775: "4330074104"
 *                         0_17592186044415: "38416838404"
 *                         0_281474976710655: "721889139388"
 *                         0_4503599627370495: "2148499982157"
 *                         0_72057594037927935: "13923820928020"
 *                         0_1152921504606846975: "911012549478444"
 *                         0_18446744073709551615: "391020293812746235"
 *       400:
 *         description: Invalid block height
 */
export const getBlockHashDecimals = expressAsyncHandler(
  async (req, res, next) => {
    const { height } = req.params;

    const schema = Joi.object({
      height: Joi.number().integer().min(0).required(),
    });

    const { error, value } = schema.validate({ height });
    if (error) {
      throw new ApiError(
        400,
        HTTP_ERR_CODES[400],
        'Validation failed',
        error.details.map((d) => d.message)
      );
    }

    // Step 1: Get block hash from height
    const hashPayload = {
      jsonrpc: '1.0',
      id: 'curltest',
      method: 'getblockhash',
      params: [Number(value.height)],
    };

    const hashResp = await getClient().post('/', hashPayload);
    const hexHash = hashResp.data.result;

    return res.status(200).json({
      success: true,
      data: {
        hash: hexHash,
        decimals: getHexSuffixDecimals(hexHash),
      },
    });
  }
);

/**
 * @swagger
 * /blockchain/block-header/{blockhash}:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get block header by block hash
 *     parameters:
 *       - in: path
 *         name: blockhash
 *         schema:
 *           type: string
 *           example: "00000000000000000005b06ff2..."
 *         required: true
 *         description: The block hash (64-character hex)
 *       - in: query
 *         name: verbose
 *         schema:
 *           type: boolean
 *           default: true
 *         required: false
 *         description: Whether to return JSON object (`true`) or raw hex string (`false`)
 *     responses:
 *       200:
 *         description: Block header data or raw hex
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                     - type: string
 *       400:
 *         description: Invalid parameters
 */
export const getBlockHeader = expressAsyncHandler(async (req, res, next) => {
  const { blockhash } = req.params;
  const { verbose = true } = req.query;

  const schema = Joi.object({
    blockhash: Joi.string().length(64).required(),
    verbose: Joi.boolean().optional(),
  });

  const { error, value } = schema.validate({
    blockhash,
    verbose: verbose === 'false' ? false : true, // handle query string parsing
  });

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
    method: 'getblockheader',
    params: [value.blockhash, value.verbose],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /blockchain/block-stats/{height}:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get block statistics by height
 *     parameters:
 *       - in: path
 *         name: height
 *         schema:
 *           type: integer
 *         required: true
 *         description: The block height to fetch statistics for
 *     responses:
 *       200:
 *         description: Block statistics
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
 *         description: Invalid block height
 */
export const getBlockStats = expressAsyncHandler(async (req, res, next) => {
  const { height } = req.params;

  const schema = Joi.object({
    height: Joi.number().integer().min(0).required(),
  });

  const { error, value } = schema.validate({ height });

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
    method: 'getblockstats',
    params: [Number(value.height)],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /blockchain/chain-tips:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get all known blockchain tips
 *     description: Returns information about all known tips in the block tree, including the main chain and stale forks.
 *     responses:
 *       200:
 *         description: List of chain tips
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
 *         description: Server error or node not responding
 */
export const getChainTips = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getchaintips',
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
 * /blockchain/chain-tx-stats:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get transaction statistics over recent blocks
 *     parameters:
 *       - in: query
 *         name: nblocks
 *         schema:
 *           type: integer
 *           example: 200
 *         required: false
 *         description: Number of blocks to include in stats (defaults to approx. 1 month)
 *       - in: query
 *         name: blockhash
 *         schema:
 *           type: string
 *           example: "0000000000000000000a1b2c3d4e5f67890123456789abcdef1234567890abcd"
 *         required: false
 *         description: Optional block hash to start counting from (default is chain tip)
 *     responses:
 *       200:
 *         description: Chain transaction stats
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
export const getChainTxStats = expressAsyncHandler(async (req, res, next) => {
  const { nblocks, blockhash } = req.query;

  const schema = Joi.object({
    nblocks: Joi.number().integer().min(1).optional(),
    blockhash: Joi.string().length(64).optional(),
  });

  const { error, value } = schema.validate({ nblocks, blockhash });

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'request validation failed',
      error.details.map((d) => d.message)
    );
  }

  const params = [];
  if (value.nblocks !== undefined) params.push(value.nblocks);
  if (value.blockhash !== undefined) params.push(value.blockhash);

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getchaintxstats',
    params,
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /blockchain/difficulty:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get current mining difficulty
 *     description: Returns the current difficulty target as a multiple of the minimum difficulty.
 *     responses:
 *       200:
 *         description: Current network difficulty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: number
 *                   example: 816548445211.7812
 *       500:
 *         description: Node error or connection issue
 */
export const getDifficulty = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getdifficulty',
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
 * /blockchain/mempool/ancestors/{txid}:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get mempool ancestor transactions for a given TXID
 *     parameters:
 *       - in: path
 *         name: txid
 *         required: true
 *         schema:
 *           type: string
 *           example: "4a5e1e4b..."
 *         description: The TXID of the transaction in the mempool
 *       - in: query
 *         name: verbose
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Whether to return full transaction details or just TXIDs
 *     responses:
 *       200:
 *         description: List of ancestor transactions or their TXIDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                     - type: array
 *       400:
 *         description: Invalid TXID format
 */
export const getMempoolAncestors = expressAsyncHandler(
  async (req, res, next) => {
    const { txid } = req.params;
    const { verbose = true } = req.query;

    const schema = Joi.object({
      txid: Joi.string().length(64).required(),
      verbose: Joi.boolean().optional(),
    });

    const { error, value } = schema.validate({
      txid,
      verbose: verbose === 'false' ? false : true,
    });

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
      method: 'getmempoolancestors',
      params: [value.txid, value.verbose],
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
 * /blockchain/mempool/descendants/{txid}:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get mempool descendant transactions for a given TXID
 *     parameters:
 *       - in: path
 *         name: txid
 *         required: true
 *         schema:
 *           type: string
 *           example: "4a5e1e4baab89f3a32518a..."
 *         description: The TXID of the transaction in the mempool
 *       - in: query
 *         name: verbose
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Whether to return full transaction details (`true`) or just TXIDs (`false`)
 *     responses:
 *       200:
 *         description: List of descendant transactions or their TXIDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   oneOf:
 *                     - type: array
 *                       items:
 *                         type: string
 *                     - type: object
 *       400:
 *         description: Invalid TXID
 */
export const getMempoolDescendants = expressAsyncHandler(
  async (req, res, next) => {
    const { txid } = req.params;
    const { verbose = true } = req.query;

    const schema = Joi.object({
      txid: Joi.string().length(64).required(),
      verbose: Joi.boolean().optional(),
    });

    const { error, value } = schema.validate({
      txid,
      verbose: verbose === 'false' ? false : true,
    });

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
      method: 'getmempooldescendants',
      params: [value.txid, value.verbose],
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
 * /blockchain/mempool/entry/{txid}:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get detailed mempool information for a specific TXID
 *     parameters:
 *       - in: path
 *         name: txid
 *         required: true
 *         schema:
 *           type: string
 *           example: "4a5e1e4baab89f3a32518a..."
 *         description: The transaction ID present in the mempool
 *     responses:
 *       200:
 *         description: Mempool entry details
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
 *         description: Invalid or missing TXID
 */
export const getMempoolEntry = expressAsyncHandler(async (req, res, next) => {
  const { txid } = req.params;

  const schema = Joi.object({
    txid: Joi.string().length(64).required(),
  });

  const { error, value } = schema.validate({ txid });

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
    method: 'getmempoolentry',
    params: [value.txid],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /blockchain/mempool/info:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get summary information about the current mempool
 *     description: Returns general statistics about the contents and status of the memory pool.
 *     responses:
 *       200:
 *         description: Mempool summary information
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
 *                     size:
 *                       type: integer
 *                       description: Number of transactions in the mempool
 *                     bytes:
 *                       type: integer
 *                       description: Total size of mempool in bytes
 *                     usage:
 *                       type: integer
 *                       description: Total memory usage
 *                     maxmempool:
 *                       type: integer
 *                       description: Maximum allowed memory usage
 *                     mempoolminfee:
 *                       type: number
 *                       description: Minimum fee for transaction to be accepted
 *       500:
 *         description: Server error or node not responding
 */
export const getMempoolInfo = expressAsyncHandler(async (req, res, next) => {
  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'getmempoolinfo',
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
 * /blockchain/mempool/raw:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get raw mempool data
 *     description: Returns either a list of TXIDs (verbose=false) or detailed mempool transaction info (verbose=true).
 *     parameters:
 *       - in: query
 *         name: verbose
 *         schema:
 *           type: boolean
 *           default: false
 *         required: false
 *         description: Whether to return detailed transaction objects or just TXIDs
 *     responses:
 *       200:
 *         description: Raw mempool contents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   oneOf:
 *                     - type: array
 *                       items:
 *                         type: string
 *                     - type: object
 *       400:
 *         description: Invalid query parameter
 */
export const getRawMempool = expressAsyncHandler(async (req, res, next) => {
  const { verbose = false } = req.query;

  const schema = Joi.object({
    verbose: Joi.boolean().optional(),
  });

  const { error, value } = schema.validate({
    verbose: verbose === 'true' || verbose === true,
  });

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
    method: 'getrawmempool',
    params: [value.verbose],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /blockchain/txout/{txid}/{index}:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get details of an unspent transaction output (UTXO)
 *     parameters:
 *       - in: path
 *         name: txid
 *         required: true
 *         schema:
 *           type: string
 *           example: "4a5e1e4baab89f3a32518a..."
 *         description: The transaction ID
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *         description: The output index (vout)
 *       - in: query
 *         name: include_mempool
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Whether to include mempool transactions in the check
 *     responses:
 *       200:
 *         description: UTXO details or null if spent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                     - type: "null"
 *       400:
 *         description: Invalid parameters
 */
export const getTxOut = expressAsyncHandler(async (req, res, next) => {
  const { txid, index } = req.params;
  const { include_mempool = true } = req.query;

  const schema = Joi.object({
    txid: Joi.string().length(64).required(),
    index: Joi.number().integer().min(0).required(),
    include_mempool: Joi.boolean().optional(),
  });

  const { error, value } = schema.validate({
    txid,
    index,
    include_mempool: include_mempool === 'false' ? false : true,
  });

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
    method: 'gettxout',
    params: [value.txid, value.index, value.include_mempool],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /blockchain/txout-proof/{txid}:
 *   get:
 *     tags:
 *     - Blockchain API
 *     summary: Get Merkle proof that a transaction is in a block
 *     parameters:
 *       - in: path
 *         name: txid
 *         required: true
 *         schema:
 *           type: string
 *           example: "4a5e1e4baab89f3a32518a..."
 *         description: Transaction ID to prove
 *       - in: query
 *         name: blockhash
 *         required: false
 *         schema:
 *           type: string
 *           example: "0000000000000000000..."
 *         description: Optional block hash to search in
 *     responses:
 *       200:
 *         description: Raw proof (hex) of transaction inclusion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: string
 *       400:
 *         description: Invalid txid or query parameter
 */
export const getTxOutProof = expressAsyncHandler(async (req, res, next) => {
  const { txid } = req.params;
  const { blockhash } = req.query;

  const schema = Joi.object({
    txid: Joi.string().length(64).required(),
    blockhash: Joi.string().length(64).optional(),
  });

  const { error, value } = schema.validate({ txid, blockhash });

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'request validation failed',
      error.details.map((d) => d.message)
    );
  }

  const params = [[value.txid]];
  if (value.blockhash) params.push(value.blockhash);

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'gettxoutproof',
    params,
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /blockchain/scan-utxos:
 *   post:
 *     tags:
 *     - Blockchain API
 *     summary: Scan the UTXO set for specific descriptors or addresses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [scanobjects]
 *             properties:
 *               scanobjects:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     desc:
 *                       type: string
 *                       example: "addr(1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)"
 *                     range:
 *                       type: integer
 *                       example: 1000
 *     responses:
 *       200:
 *         description: UTXOs found
 */
export const scanUTXOSet = expressAsyncHandler(async (req, res, next) => {
  const schema = Joi.object({
    scanobjects: Joi.array()
      .items(
        Joi.object({
          desc: Joi.string().required(),
          range: Joi.number().optional(),
        })
      )
      .min(1)
      .required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'Invalid scan request',
      error.details.map((d) => d.message)
    );
  }

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'scantxoutset',
    params: ['start', value.scanobjects],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});

/**
 * @swagger
 * /blockchain/verify-txout-proof:
 *   post:
 *     tags:
 *     - Blockchain API
 *     summary: Verify Merkle proof of transaction inclusion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proof
 *             properties:
 *               proof:
 *                 type: string
 *                 example: "04000020abcd..."
 *     responses:
 *       200:
 *         description: Verified transaction IDs
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
 */
export const verifyTxOutProof = expressAsyncHandler(async (req, res, next) => {
  const schema = Joi.object({
    proof: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    throw new ApiError(
      400,
      HTTP_ERR_CODES[400],
      'Invalid proof format',
      error.details.map((d) => d.message)
    );
  }

  const payload = {
    jsonrpc: '1.0',
    id: 'curltest',
    method: 'verifytxoutproof',
    params: [value.proof],
  };

  const info = await getClient().post('/', payload);

  return res.status(200).json({
    success: true,
    data: info.data.result,
  });
});
