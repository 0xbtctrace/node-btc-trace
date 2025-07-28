import axios from 'axios';
import { envConfig } from './envConf.js';

export const getClient = () => {
  // validate env variables
  if (
    !envConfig.SELF_HOSTED_BTC_HOST ||
    !envConfig.SELF_HOSTED_BTC_USERNAME ||
    !envConfig.SELF_HOSTED_BTC_PASSWORD
  ) {
    throw new Error(
      'Missing Bitcoin node configuration environment variables.'
    );
  }

  const authToken = `Basic ${Buffer.from(
    `${envConfig.SELF_HOSTED_BTC_USERNAME}:${envConfig.SELF_HOSTED_BTC_PASSWORD}`
  ).toString('base64')}`;

  return axios.create({
    baseURL: envConfig.SELF_HOSTED_BTC_HOST,
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
  });
};
