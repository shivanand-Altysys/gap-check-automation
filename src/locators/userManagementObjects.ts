// locators/userManagementObjects.ts

import { LocatorStrategy } from '../core/locatorStrategy';
import { CSSLocator, XPathLocator } from '../types';

export class UserManagementLocators {

  /**
   * Add User Button
   */
  readonly ADD_USER_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Add User")'
  };

  /**
   * Search by email input
   */
  readonly SEARCH_EMAIL_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input.grid-filter-input-chip__input[placeholder="Filter by email…"]'
  };

  /**
   * User row by email — dynamic
   */
  userRowByEmail(email: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//a[contains(@href,"mailto:${email}")]]`
    };
  }

  /**
   * Edit button in user row — dynamic
   */
  editButtonByEmail(email: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//a[contains(@href,"mailto:${email}")]]//button[@aria-label="Edit row"]`
    };
  }

  /**
   * Delete button in user row — dynamic
   */
  deleteButtonByEmail(email: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//a[contains(@href,"mailto:${email}")]]//button[@aria-label="Delete row"]`
    };
  }

  readonly CONFIRM_DELETE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]'
  };

  /**
   * User name cell in table — dynamic by email
   */
  userNameByEmail(email: string) {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//a[contains(@href,"mailto:${email}")]]/td[2]`
    };
  }

  /**
   * Toggle switch by email — dynamic
   */
  toggleSwitchByEmail(email: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//a[contains(@href,"mailto:${email}")]]//input[@role="switch"]`
    };
  }

  /**
   * User status badge by email — dynamic
   */
  userStatusByEmail(email: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//a[contains(@href,"mailto:${email}")]]/td[6]//span[contains(@class,"badge")]`
    };
  }

  /**
   * Confirm deactivate button in modal
   */
  readonly CONFIRM_DEACTIVATE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]'
  };

  /**
 * Cancel button on Add User form
 */
  readonly CANCEL_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Cancel")'
  };

  /**
   * Status filter dropdown
   */
  readonly STATUS_FILTER_DROPDOWN: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.grid-top-controls__chips .select-trigger'
  };

  /**
     * Status filter option — dynamic by status label
     */
  statusFilterOptionByName(status: string): CSSLocator {
    return {
      strategy: LocatorStrategy.CSS,
      value: `button[role="option"]:text-is("${status}")`
    };
  }
  /**
   * All status badges currently visible in the table
   */
  readonly ALL_STATUS_BADGES: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'tbody tr td:nth-child(6) span[class*="badge"]'
  };

}