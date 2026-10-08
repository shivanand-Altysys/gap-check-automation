import { expect } from '@playwright/test';
import { Page } from 'playwright';
import { Locator } from '../types';
import { Actions } from './actions';
import { getLogger } from '../core/logger';

const logger = getLogger('assertions');

/**
 * Assertions utility class
 * Provides type-safe assertion wrappers around Playwright's expect API
 * Includes detailed error logging for debugging
 */
export class Assertions {
  /**
   * Verify element text content matches expected value
   * @param page Playwright Page instance
   * @param locator Strategy-based locator
   * @param expectedText Expected text content
   * @throws Error if text doesn't match
   */
  static async verifyText(
    page: Page,
    locator: Locator,
    expectedText: string,
    timeout: number = 10000
  ): Promise<void> {
    try {
      const element = Actions.resolve(page, locator);
      await expect(element).toHaveText(expectedText, { timeout });
    } catch (err) {
      logger.error('verifyText failed!');
      logger.error(`Locator  : ${locator.value}`);
      logger.error(`Expected : ${expectedText}`);
      logger.error(`Reason   : ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Verify element is visible on page
   * Waits for element to become visible
   * @param page Playwright Page instance
   * @param locator Strategy-based locator
   * @param timeout Optional timeout in milliseconds (default: 10000)
   * @throws Error if element is not visible
   */
  static async verifyElementVisible(
    page: Page,
    locator: Locator,
    timeout: number = 10000
  ): Promise<void> {
    try {
      const element = Actions.resolve(page, locator);
      await element.waitFor({ state: 'visible', timeout });
    } catch (err) {
      logger.error('verifyElementVisible failed!');
      logger.error(`Locator  : ${locator.value}`);
      logger.error(`Strategy : ${locator.strategy}`);
      logger.error(`Reason   : ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Verify an input/textarea's current value matches expected (auto-retries
   * until it matches or times out — handles reactive fields that update
   * asynchronously, e.g. an auto-derived key)
   * @param page Playwright Page instance
   * @param locator Strategy-based locator
   * @param expectedValue Expected field value
   * @throws Error if value doesn't match
   */
  static async verifyValue(
    page: Page,
    locator: Locator,
    expectedValue: string,
    timeout: number = 10000
  ): Promise<void> {
    try {
      const element = Actions.resolve(page, locator);
      await expect(element).toHaveValue(expectedValue, { timeout });
    } catch (err) {
      logger.error('verifyValue failed!');
      logger.error(`Locator  : ${locator.value}`);
      logger.error(`Expected : ${expectedValue}`);
      logger.error(`Reason   : ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Verify current page URL contains expected string
   * @param page Playwright Page instance
   * @param expectedUrl Expected URL substring or regex pattern
   * @param timeout Optional timeout in milliseconds (default: 5000)
   * @throws Error if URL doesn't match
   */
  static async verifyUrlContains(
    page: Page,
    expectedUrl: string,
    timeout: number = 5000
  ): Promise<void> {
    try {
      await expect(page).toHaveURL(new RegExp(expectedUrl), { timeout });
    } catch (err) {
      logger.error('verifyUrlContains failed!');
      logger.error(`Expected : URL to contain "${expectedUrl}"`);
      logger.error(`Current  : ${page.url()}`);
      logger.error(`Reason   : ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Verify current page URL does NOT contain expected string
   * @param page Playwright Page instance
   * @param value URL substring that should not be present
   * @param timeout Optional timeout in milliseconds (default: 5000)
   * @throws Error if URL contains the value
   */
  static async verifyUrlNotContains(
    page: Page,
    value: string,
    timeout: number = 5000
  ): Promise<void> {
    try {
      await expect(page).not.toHaveURL(new RegExp(value), { timeout });
    } catch (err) {
      logger.error('verifyUrlNotContains failed!');
      logger.error(`Expected : URL to NOT contain "${value}"`);
      logger.error(`Current  : ${page.url()}`);
      logger.error(`Reason   : ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Verify element text contains expected value
   * @param page Playwright Page instance
   * @param locator Strategy-based locator
   * @param expectedText Expected partial text
   * @throws Error if text does not contain expected value
   */
  static async verifyTextContains(
    page: Page,
    locator: Locator,
    expectedText: string
  ): Promise<void> {

    try {

      const actualText = await Actions.getText(
        page,
        locator
      );

      logger.info(`Expected : ${expectedText}`);

      logger.info(`Actual   : ${actualText}`);

      expect(actualText?.trim()).toContain(
        expectedText
      );

    } catch (err) {

      logger.error('verifyTextContains failed!');

      logger.error(`Locator  : ${locator.value}`);

      logger.error(`Expected : ${expectedText}`);

      logger.error(`Reason   : ${(err as Error).message}`);

      throw err;
    }
  }

  /**
   * Verify multiple validation messages are visible
   * @param page Playwright Page instance
   * @param locator Strategy-based locator
   * @param expectedMessages Expected validation messages
   */
  static async verifyTexts(
    page: Page,
    locator: Locator,
    expectedMessages: string[]
  ): Promise<void> {

    const actualText = await Actions.getAllTexts(
      page,
      locator
    );

    for (const message of expectedMessages) {

      expect(
        actualText
      ).toContain(message);

      logger.info(`Validated error message : ${message}`);
    }
  }
}
