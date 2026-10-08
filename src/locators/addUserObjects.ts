// locators/addUserObjects.ts

import { LocatorStrategy } from '../core/locatorStrategy';

export class AddUserLocators {

  /**
   * Form Inputs
   */
  readonly FULL_NAME_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="e.g. Jane Smith"]'
  };

  readonly EMAIL_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="email"]'
  };

  readonly PASSWORD_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="password"]'
  };

  readonly GROUPS_CONTROL = {
    strategy: LocatorStrategy.XPATH,
    value: '//label[contains(normalize-space(.), "Groups")]/following::*[contains(@class, "ms-control")][1]'
  };

  readonly GROUPS_SEARCH_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: '.ms-panel .ms-search__input'
  };

  readonly GROUP_OPTIONS = {
    strategy: LocatorStrategy.CSS,
    value: '.ms-panel [role="option"]'
  };

  /**
   * Actions
   */
  readonly SAVE_USER_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button[type="submit"]:has-text("Save User")'
  };

  /**
   * Validation Messages
   */
  readonly VALIDATION_MESSAGES = {
    strategy: LocatorStrategy.CSS,
    value: 'p.text-error'
  };

  /**
   * Cancel button
   */
  readonly CANCEL_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Cancel")'
  };
}
