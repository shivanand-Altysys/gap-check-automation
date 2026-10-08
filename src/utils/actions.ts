import { Page, Locator as PlaywrightLocator } from 'playwright';
import { Locator, CSSLocator, RoleLocator, TextLocator, XPathLocator, NthLocator } from '../types';

/**
 * Type guard to check if locator is CSSLocator
 */
function isCSSLocator(locator: Locator): locator is CSSLocator {
  return locator.strategy === 'css';
}

/**
 * Type guard to check if locator is RoleLocator
 */
function isRoleLocator(locator: Locator): locator is RoleLocator {
  return locator.strategy === 'role';
}

/**
 * Type guard to check if locator is TextLocator
 */
function isTextLocator(locator: Locator): locator is TextLocator {
  return locator.strategy === 'text';
}

/**
 * Type guard to check if locator is XPathLocator
 */
function isXPathLocator(locator: Locator): locator is XPathLocator {
  return locator.strategy === 'xpath';
}

function isNthLocator(locator: Locator): locator is NthLocator {
  return locator.strategy === 'nth';
}



/**
 * Actions utility class
 * Provides abstraction over Playwright element interactions
 */
export class Actions {
  /**
   * Resolve a strategy-based locator to a Playwright Locator
   * @param page Playwright Page instance
   * @param locator Strategy-based locator object
   * @returns Playwright Locator
   * @throws Error if strategy is unsupported
   */
  static resolve(page: Page, locator: Locator): PlaywrightLocator {
    if (isCSSLocator(locator)) {
      return page.locator(locator.value);
    }

    if (isRoleLocator(locator)) {
      return page.getByRole(locator.role as any, {
        name: locator.value,
        exact: locator.exact || false,
      });
    }

    if (isTextLocator(locator)) {
      return page.getByText(locator.value, {
        exact: locator.exact || false,
      });
    }

    if (isXPathLocator(locator)) {
      return page.locator(`xpath=${locator.value}`);
    }

    if (isNthLocator(locator)) {
      return page.locator(locator.value).nth(locator.index);
    }

    throw new Error(`Unsupported locator strategy: ${(locator as any).strategy}`);
  }

  /**
   * Click an element identified by locator
   * Waits for visibility before clicking
   * @param page Playwright Page instance
   * @param locator Strategy-based locator
   * @param timeout Optional timeout in milliseconds (default: 30000)
   * @returns Promise<void>
   */
  static async click(page: Page, locator: Locator, timeout: number = 30000): Promise<void> {
    const element = this.resolve(page, locator);
    await element.waitFor({ state: 'visible', timeout });
    await element.click();
  }

  /**
   * Type text into an element
   * Waits for visibility before typing
   * @param page Playwright Page instance
   * @param locator Strategy-based locator
   * @param value Text to type
   * @param timeout Optional timeout in milliseconds (default: 30000)
   * @returns Promise<void>
   */
  static async type(
    page: Page,
    locator: Locator,
    value: string,
    timeout: number = 30000
  ): Promise<void> {
    const element = this.resolve(page, locator);
    await element.waitFor({ state: 'visible', timeout });
    await element.fill(value);
  }

  /**
   * Get text content of an element
   * @param page Playwright Page instance
   * @param locator Strategy-based locator
   * @returns Element text content or null
   */
  static async getText(page: Page, locator: Locator): Promise<string | null> {
    const element = this.resolve(page, locator);
    return await element.textContent();
  }

  /**
   * Check if element is visible
   * @param page Playwright Page instance
   * @param locator Strategy-based locator
   * @returns true if visible, false otherwise
   */
  static async isVisible(page: Page, locator: Locator): Promise<boolean> {
    const element = this.resolve(page, locator);
    return await element.isVisible();
  }

/**
 * Clear an input field
 * Waits for visibility before clearing
 * @param page Playwright Page instance
 * @param locator Strategy-based locator
 * @param timeout Optional timeout in milliseconds (default: 30000)
 * @returns Promise<void>
 */
  static async clear(
    page: Page,
    locator: Locator,
    timeout: number = 30000
  ): Promise<void> {
    const element = this.resolve(page, locator);
    await element.waitFor({ state: 'visible', timeout });
    await element.clear();
  }

  /**
   * Get all text contents from matching elements
   * @param page Playwright Page instance
   * @param locator Strategy-based locator
   * @returns Array of text contents
   */
  static async getAllTexts(
    page: Page,
    locator: Locator
  ): Promise<string[]> {

    const element = this.resolve(page, locator);

    const texts = await element.allTextContents();

    return texts.map(text => text.trim());
  }
}
