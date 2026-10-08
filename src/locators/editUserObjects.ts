import { LocatorStrategy } from '../core/locatorStrategy';

export class EditUserLocators {

  /**
   * Form Inputs
   */
  readonly FULL_NAME_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="e.g. Jane Smith"]'
  };

  /**
   * Email is read-only — used for verification only
   */
  readonly EMAIL_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="email"]'
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
  readonly SAVE_CHANGES_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button[type="submit"]:has-text("Save Changes")'
  };

}
