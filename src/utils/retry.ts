import { getLogger } from '../core/logger';

const logger = getLogger('retry');

/**
 * Retry utility class
 * Provides simple retry mechanism for flaky operations
 */
export class Retry {
  /**
   * Execute a callback with retry logic
   * @param callback Function to execute
   * @param maxRetries Maximum number of retry attempts (default: 3)
   * @returns Result of callback
   * @throws Error from last attempt if all retries fail
   */
  static async execute<T>(
    callback: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      try {
        return await callback();
      } catch (error) {
        logger.warn(`Retry Attempt ${attempt} Failed: ${(error as Error).message}`);
        lastError = error as Error;
      }
    }

    throw lastError;
  }
}
