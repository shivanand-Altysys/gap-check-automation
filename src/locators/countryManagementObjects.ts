import { LocatorStrategy } from '../core/locatorStrategy';
import { CSSLocator, XPathLocator } from '../types';

export class CountryManagementLocators {

  readonly ADD_COUNTRY_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Add Country")',
  };

  readonly SEARCH_TITLE_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="Filter by title…"]',
  };

  readonly CONFIRM_DELETE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]',
  };

  countryRowByTitle(title: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//td[normalize-space()="${title}" or .//*[normalize-space()="${title}"]]]`,
    };
  }

  countryTitleByTitle(title: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//td[normalize-space()="${title}" or .//*[normalize-space()="${title}"]]]/td[2]`,
    };
  }

  editButtonByTitle(title: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//td[normalize-space()="${title}" or .//*[normalize-space()="${title}"]]]//button[@aria-label="Edit row"]`,
    };
  }

  deleteButtonByTitle(title: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//td[normalize-space()="${title}" or .//*[normalize-space()="${title}"]]]//button[@aria-label="Delete row"]`,
    };
  }
}
