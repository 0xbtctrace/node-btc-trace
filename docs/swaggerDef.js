import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
    version: '0.0.2',
    description,
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  tags: [
    {
      name: 'Blockchain',
      description: 'Endpoints related to blockchain',
    },
  ],
};

export default config;
