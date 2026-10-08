import { LocatorStrategy } from '../core/locatorStrategy';

export class CreateTemplateLocators {
  readonly TEMPLATE_NAME_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="Enter Here"]'
  };

  readonly DOMAIN_DROPDOWN = {
    strategy: LocatorStrategy.CSS,
    value: 'button.select-trigger'
  };

  domainOption(domain: string) {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//button[@role="option" and normalize-space()="${domain}"]`
    };
  }

  readonly DESCRIPTION_TEXTAREA = {
    strategy: LocatorStrategy.CSS,
    value: 'textarea[placeholder="Enter Here"]'
  };

  readonly CREATE_SECTION_YES = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Yes")'
  };

  readonly CREATE_SECTION_NO = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("No")'
  };

  readonly PROCEED_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Proceed")'
  };

  readonly CANCEL_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Cancel")'
  };

  readonly VALIDATION_MESSAGES = {
    strategy: LocatorStrategy.CSS,
    value: 'p.text-error'
  };

  readonly SECTION_NAME_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: '.app-modal input[placeholder="e.g. Working hours"]'
  };

  readonly SAVE_SECTION_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: '.app-modal button:has-text("Save")'
  };
}
