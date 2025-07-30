/**
 * To config the dotenv in separate module, To make the .env variables
 * available across all modules (specifically in db.js).
 * Note: make sure this module is imported before all other modules.
 */
import dotenv from 'dotenv';
import Joi from 'joi';
import { isHostSyntaxValid } from '../utils/generals.js';

// env config
dotenv.config({ path: `./config/.env` });

const validateHosts = Joi.array()
  .items(
    Joi.string().custom((value, helpers) => {
      // Validate hostname
      if (isHostSyntaxValid(value)) {
        return value;
      }

      return helpers.error('any.invalid', { value });
    }, 'host validation')
  )
  .min(1)
  .required();

// Schema for environment variables
const envSchema = Joi.object({
  NODE_ENV: Joi.string(),
  PORT: Joi.number().required(),
  CORS_CONFIG: Joi.string().required(),
  SELF_HOSTED_BTC_HOST: Joi.string().required(),
  SELF_HOSTED_BTC_USERNAME: Joi.string().required(),
  SELF_HOSTED_BTC_PASSWORD: Joi.string().required(),
  SWAGGER_SERVERS: validateHosts,
}).unknown(); // Allow other unspecified variable

// parse SWAGGER_SERVERS
let servers = process.env.SWAGGER_SERVERS || '';
servers = servers.split(',').map((h) => h.trim());

// Validate the environment variables
const { error, value: envVars } = envSchema.validate({
  ...process.env,
  SWAGGER_SERVERS: servers,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export the validated variables
export const envConfig = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  CORS_CONFIG: envVars.CORS_CONFIG,
  SELF_HOSTED_BTC_HOST: envVars.SELF_HOSTED_BTC_HOST,
  SELF_HOSTED_BTC_USERNAME: envVars.SELF_HOSTED_BTC_USERNAME,
  SELF_HOSTED_BTC_PASSWORD: envVars.SELF_HOSTED_BTC_PASSWORD,
  SWAGGER_SERVERS: envVars.SWAGGER_SERVERS,
};
