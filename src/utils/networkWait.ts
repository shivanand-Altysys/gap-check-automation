import { Page, Response } from 'playwright';
import { getLogger } from '../core/logger';

const logger = getLogger('network-wait');

/**
 * Network Wait Utility
 * Provides methods to wait for API responses and network idle states
 * Resolves flakiness caused by asynchronous API calls
 */
export class NetworkWait {
  /**
   * Wait for a specific API endpoint to complete and return successfully
   * @param page Playwright Page instance
   * @param urlPattern URL pattern or regex to match API endpoint
   * @param timeout Max wait time in milliseconds (default: 10000)
   * @returns Response object from the API call
   * @throws Error if API doesn't respond, fails, or times out
   *
   * @example
   * // Wait for search API to complete
   * await NetworkWait.waitForApiResponse(page, /api\/users\/search/, 5000);
   * // Then assert results are loaded
   * await Assertions.verifyElementVisible(page, locators.USER_TABLE);
   */
  static async waitForApiResponse(
    page: Page,
    urlPattern: string | RegExp,
    timeout: number = 10000
  ): Promise<Response> {
    logger.info(`Waiting for API response matching: ${urlPattern}`);

    try {
      const response = await page.waitForResponse(
        (resp) => {
          const matches = typeof urlPattern === 'string'
            ? resp.url().includes(urlPattern)
            : urlPattern.test(resp.url());
          return matches;
        },
        { timeout }
      );

      const status = response.status();
      logger.info(`API response received: ${response.url()} - Status ${status}`);

      // Validate success status (2xx)
      if (status < 200 || status >= 300) {
        throw new Error(
          `API returned non-success status: ${status}. URL: ${response.url()}`
        );
      }

      return response;
    } catch (error) {
      logger.error(
        `Failed to receive API response for ${urlPattern}: ${(error as Error).message}`
      );
      throw new Error(
        `API response timeout or failed for ${urlPattern}: ${(error as Error).message}`
      );
    }
  }

  /**
   * Wait for an API response on a specific endpoint path and ensure a query parameter exists
   * @param page Playwright Page instance
   * @param endpointPath Subpath to match in the URL (e.g. '/api/v1/users/')
   * @param queryKey Query parameter key that must be present (e.g. 'email')
   * @param timeout Max wait time in milliseconds (default: 10000)
   * @returns Response object from the API call
   */
  static async waitForApiResponseWithQuery(
    page: Page,
    endpointPath: string,
    queryKey: string,
    timeout: number = 10000
  ): Promise<Response> {
    logger.info(`Waiting for API response on endpoint: ${endpointPath} with query param: ${queryKey}`);

    try {
      const response = await page.waitForResponse(
        (resp) => {
          try {
            const url = resp.url();
            if (!url.includes(endpointPath)) return false;
            const parsed = new URL(url);
            return parsed.searchParams.has(queryKey);
          } catch (e) {
            return false;
          }
        },
        { timeout }
      );

      const status = response.status();
      logger.info(`API response received: ${response.url()} - Status ${status}`);

      if (status < 200 || status >= 300) {
        throw new Error(`API returned non-success status: ${status}. URL: ${response.url()}`);
      }

      return response;
    } catch (error) {
      logger.error(
        `Failed to receive API response for ${endpointPath}?${queryKey}= : ${(error as Error).message}`
      );
      throw new Error(
        `API response timeout or failed for ${endpointPath}?${queryKey}=: ${(error as Error).message}`
      );
    }
  }

  /**
   * Wait for network to be completely idle (no pending requests)
   * Useful after user interactions that may trigger multiple API calls
   * @param page Playwright Page instance
   * @param timeout Max wait time in milliseconds (default: 5000)
   *
   * @example
   * await Actions.type(page, searchLocator, 'test@example.com');
   * await NetworkWait.waitForNetworkIdle(page, 3000);
   * // Now all API calls have completed
   */
  static async waitForNetworkIdle(
    page: Page,
    timeout: number = 5000
  ): Promise<void> {
    logger.info('Waiting for network to be idle...');

    try {
      await page.waitForLoadState('networkidle', { timeout });
      logger.info('Network is idle - all requests completed');
    } catch (error) {
      logger.warn(
        `Network idle timeout (${timeout}ms) - some requests may still be pending: ${(error as Error).message}`
      );
      // Don't throw - continue execution (network might be genuinely slow)
    }
  }

  /**
   * Combined: Wait for API response + Network idle
   * Most reliable for search/filter operations
   * @param page Playwright Page instance
   * @param apiPattern API endpoint URL pattern to wait for
   * @param options Timeout overrides
   *
   * @example
   * await Actions.type(page, searchInput, 'email@test.com');
   * await NetworkWait.waitForApiAndIdle(page, /api\/users\/search/, { apiTimeout: 5000, idleTimeout: 3000 });
   * // Now definitely safe to assert results
   */
  static async waitForApiAndIdle(
    page: Page,
    apiPattern: string | RegExp,
    options: { apiTimeout?: number; idleTimeout?: number } = {}
  ): Promise<void> {
    const { apiTimeout = 10000, idleTimeout = 5000 } = options;

    logger.info('Waiting for API response and network idle...');

    // Wait for specific API
    await this.waitForApiResponse(page, apiPattern, apiTimeout);

    // Then wait for network to be idle
    await this.waitForNetworkIdle(page, idleTimeout);

    logger.info('API and network idle - safe to assert results');
  }
}
