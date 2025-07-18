import * as dotenv from 'dotenv';
import { beforeAll } from 'vitest';

// Load environment variables for testing
beforeAll(() => {
  dotenv.config();
  
  // Validate required environment variables for integration tests
  const requiredEnvVars = ['HARVEST_ACCOUNT_ID', 'HARVEST_ACCESS_TOKEN'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables for integration tests: ${missingVars.join(', ')}\n` +
      'Please ensure your .env file is configured with valid Harvest credentials.'
    );
  }
  
  console.log('Integration test setup complete - Harvest credentials verified');
});