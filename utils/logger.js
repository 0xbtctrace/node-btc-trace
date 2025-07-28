import pino from 'pino';
import { pinoHttp } from 'pino-http';

const isProd = process.env.NODE_ENV === 'production';

const istNow = () =>
  new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3, // ✅ shows milliseconds
    hour12: false,
  });

export const logger = pino({
  level: isProd ? 'info' : 'debug', // ⬅️ Only logs 'debug' in dev,
  formatters: {
    log(object) {
      return {
        ...object,
        istNow: istNow(),
      };
    },
  },
  transport: !isProd
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true, // enable colors
          translateTime: false,
          ignore: 'pid,hostname', // skip less useful fields
        },
      }
    : undefined, // no pretty in prod
});

export const httpLogger = pinoHttp({
  level: isProd ? 'info' : 'debug', // ⬅️ Only logs 'debug' in dev,
  genReqId: (req) => {
    const defaultReqId = req.id;
    if (defaultReqId != undefined) {
      return defaultReqId;
    }
    // generate new request id
    return `http_${Date.now().toString()}`;
  },
  formatters: {
    log(object) {
      return {
        ...object,
        istNow: istNow(),
      };
    },
  },
  serializers: {
    req(req) {
      return req;
    },
    res(res) {
      return res;
    },
  },
  transport: !isProd
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true, // enable colors
          translateTime: 'yyyy-mm-dd HH:MM:ss o', // includes offset like "+0530"
        },
      }
    : undefined, // no pretty in prod
});
