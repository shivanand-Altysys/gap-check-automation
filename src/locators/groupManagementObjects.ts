import { LocatorStrategy } from '../core/locatorStrategy';
import { CSSLocator, XPathLocator } from '../types';

export class GroupManagementLocators {
  readonly ADD_GROUP_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Add Group")'
  };

  readonly GROUP_NAME_INPUT: XPathLocator = {
    strategy: LocatorStrategy.XPATH,
    value: '//label[contains(normalize-space(.), "Group Name")]/following::input[1]'
  };

  readonly ROLE_SELECT: XPathLocator = {
    strategy: LocatorStrategy.XPATH,
    value: '//label[normalize-space()="Role"]/following::*[normalize-space()="Select role"][1]'
  };

  readonly DOMAIN_SELECT: XPathLocator = {
    strategy: LocatorStrategy.XPATH,
    value: '//label[contains(normalize-space(.), "Domain")]/following::*[normalize-space()="Select domain"][1]'
  };

  readonly COUNTRY_SELECT: XPathLocator = {
    strategy: LocatorStrategy.XPATH,
    value: '//label[normalize-space()="Country"]/following::button[contains(@class, "country-dd-trigger")][1]'
  };

  readonly ADD_ROW_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Add Row")'
  };

  readonly SAVE_GROUP_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Save Group")'
  };

  readonly SAVE_CHANGES_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Save Changes")'
  };

  readonly CANCEL_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Cancel")'
  };

  readonly ALERT_DIALOG_TITLE: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="alert-dialog"] .alert-dialog__title'
  };

  readonly ALERT_DIALOG_MESSAGE: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="alert-dialog"] .alert-dialog__message'
  };

  readonly ALERT_DIALOG_DISMISS_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="alert-dialog-dismiss"]'
  };

  readonly SEARCH_GROUP_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="Filter by name…"]'
  };

  readonly CONFIRM_DELETE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]'
  };

  readonly VALIDATION_MESSAGES: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'p.text-error'
  };

  readonly GROUP_NAME_ERROR_WRAPPER: XPathLocator = {
    strategy: LocatorStrategy.XPATH,
    value: '//label[contains(normalize-space(.), "Group Name")]/following::input[1]/ancestor::div[contains(@class, "pill-input-wrapper")][1]'
  };

  readonly EMPTY_COMBINATIONS_ROW: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'tr.combo-table__empty-row'
  };

  readonly COUNTRY_SEARCH_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[aria-label="Search countries"]'
  };

  groupRow(groupName: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//td[normalize-space()="${groupName}"]]`
    };
  }

  editButtonByGroupName(groupName: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//td[normalize-space()="${groupName}"]]//button[@aria-label="Edit row"]`
    };
  }

  assignmentCountBadge(groupName: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//td[normalize-space()="${groupName}"]]//span[contains(@class, "badge")]`
    };
  }

  combinationRow(roleName: string, entityName: string, countryName: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//td[normalize-space()="${roleName}"] and .//td[normalize-space()="${entityName}"] and .//td[normalize-space()="${countryName}"]]`
    };
  }

  removeCombinationButtonByRow(roleName: string, entityName: string, countryName: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//td[normalize-space()="${roleName}"] and .//td[normalize-space()="${entityName}"] and .//td[normalize-space()="${countryName}"]]//button[@aria-label="Remove combination"]`
    };
  }

  deleteButtonByGroupName(groupName: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[.//td[normalize-space()="${groupName}"]]//button[@aria-label="Delete row" or contains(@class, "delete") or .//*[contains(@class, "trash")]]`
    };
  }

  alertDialogListItem(text: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//*[@data-testid="alert-dialog"]//li[contains(@class, "alert-dialog__list-item") and normalize-space()="${text}"]`
    };
  }

  optionByText(optionText: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//div[@role="listbox"]//button[@role="option" and normalize-space()="${optionText}"]`
    };
  }

  readonly COUNTRY_OPTION_ITEMS: XPathLocator = {
    strategy: LocatorStrategy.XPATH,
    value: '//div[@role="dialog" and @aria-label="Select country"]//button[contains(@class, "country-dd-item")]'
  };
}
