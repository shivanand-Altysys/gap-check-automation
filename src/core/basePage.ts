import { Page } from 'playwright';
import { RuntimeData } from '../types';

/**
 * Base class for all page objects
 * Provides common functionality like screenshots and page access
 */
export class BasePage {
  protected page: Page;
  protected runtimeData: RuntimeData;

  /**
   * Initialize BasePage with Playwright Page and runtime data
   * @param page Playwright Page instance
   * @param runtimeData Shared runtime data across test
   */
  constructor(page: Page, runtimeData: RuntimeData) {
    this.page = page;
    this.runtimeData = runtimeData;
  }

  /**
   * Common Toast Body Locator
   */
  protected readonly toastBodyLocator = {
    strategy: 'css' as const,
    value: '.wi-toast-body'
  };

  /**
   * Take a full page screenshot
   * @param name Screenshot name/identifier
   * @returns Promise<void>
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * Get the Playwright page instance
   * @returns Playwright Page
   */
  getPage(): Page {
    return this.page;
  }

  /**
   * Get runtime data
   * @returns Runtime data object
   */
  getRuntimeData(): RuntimeData {
    return this.runtimeData;
  }

  async verifyToastBodyMessage(expectedMessage: string): Promise<void> {
    // Find toast by specific text directly
    const targetToast = this.page
      .locator('.wi-toast-body')
      .filter({ hasText: expectedMessage })
      .first();

    await targetToast.waitFor({ 
      state: 'visible', 
      timeout: 20000 
    });

    const actualMessage = (await targetToast.textContent())?.trim();

    if (!actualMessage?.includes(expectedMessage)) {
      throw new Error(
        `Expected toast message to contain "${expectedMessage}" but found "${actualMessage}"`
      );
    }

    const toastCard = targetToast.locator(
      'xpath=ancestor::*[contains(concat(" ", normalize-space(@class), " "), " wi-toast ")][1]'
    );

    await toastCard
      .locator('button.wi-toast-close, button[aria-label^="Dismiss"]')
      .click({ timeout: 5000 });

    await targetToast.waitFor({
      state: 'hidden',
      timeout: 5000
    });
  }
}
