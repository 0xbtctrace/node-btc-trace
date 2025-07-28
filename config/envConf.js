/**
 * To config the dotenv in separate module, To make the .env variables
 * available across all modules (specifically in db.js).
 * Note: make sure this module is imported before all other modules.
 */
import dotenv from 'dotenv';
import Joi from 'joi';

// env config
dotenv.config({ path: `./config/.env` });

// Define the schema for your environment variables
const envSchema = Joi.object({
  NODE_ENV: Joi.string(),
  PORT: Joi.number().required(),
  CORS_CONFIG: Joi.string().required(),
  SELF_HOSTED_BTC_HOST: Joi.string().required(),
  SELF_HOSTED_BTC_USERNAME: Joi.number().required(),
  SELF_HOSTED_BTC_PASSWORD: Joi.string().required(),
  QUICK_NODE_BTC_HOST: Joi.string().required(),
  API_SERVICE_PUB: Joi.string().required(),
}).unknown(); // Allow other unspecified variable

// Validate the environment variables
const { error, value: envVars } = envSchema.validate(process.env);

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
  QUICK_NODE_BTC_HOST: envVars.QUICK_NODE_BTC_HOST,
  API_SERVICE_PUB: envVars.API_SERVICE_PUB,
};
