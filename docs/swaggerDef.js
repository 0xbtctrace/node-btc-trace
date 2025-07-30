import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { envConfig } from '../config/envConf.js';
import { readPackageSync } from 'read-pkg';

// Emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the Markdown file
const description = fs.readFileSync(
  path.join(__dirname, 'description.md'),
  'utf8'
);

const config = {
  openapi: '3.0.0',
  info: {
    title: 'Bitcoin Block Explorer API',
    version: readPackageSync().version,
    description,
  },
  servers: envConfig.SWAGGER_SERVERS.map((host) => ({
    url: host,
  })),
  tags: [
    {
      name: 'Blockchain',
      description: 'Endpoints related to blockchain',
    },
  ],
};

export default config;
