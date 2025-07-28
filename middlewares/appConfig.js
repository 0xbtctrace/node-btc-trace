// library
import axios from 'axios';
import { stringify } from 'qs';
// project
import asyncHandler from '../async/async.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import logger from '../config/winston.js';
import { envConfig } from '../config/envConf.js';

/**
 * includes app configurations in the req object
 */
export const includeAppConfig = (appConfigKey) =>
  asyncHandler(async (req, res, next) => {
    if (appConfigKey === undefined) {
      throw new Error('Invalid appConfigKey to include');
    }

    try {
      if (Array.isArray(appConfigKey)) {
        const query = stringify(
          {
            key: appConfigKey,
          },
          {
            arrayFormat: 'brackets',
          }
        );

        let { data } = await axios.get(
          `${envConfig.API_UTILS_CONFIGURATIONS_PROVIDER}/app-config/key?${query}`
        );
        data = data.data;

        data.forEach((config, index) => {
          req.app_config = {
            ...req.app_config,
            [appConfigKey[index]]: config.value,
          };
        });
      } else {
        // If appConfigKey is a single string, make one API call
        const { data } = await axios.get(
          `${envConfig.API_UTILS_CONFIGURATIONS_PROVIDER}/app-config/key/${appConfigKey}`
        );
        req.app_config = {
          ...req.app_config,
          [appConfigKey]: data.data.value,
        };
      }
    } catch (error) {
      logger.error(error);
      return next(
        new ErrorResponse(
          'Error getting app config, internal server error.',
          500
        )
      );
    }

    next();
  });
