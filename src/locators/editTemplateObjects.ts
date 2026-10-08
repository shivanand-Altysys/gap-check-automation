import { LocatorStrategy } from '../core/locatorStrategy';

export class EditTemplateLocators {
  readonly TEMPLATE_NAME_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="Enter Here"]'
  };

  readonly DOMAIN_DROPDOWN = {
    strategy: LocatorStrategy.CSS,
    value: 'div[role="combobox"]'
  };

  readonly DESCRIPTION_TEXTAREA = {
    strategy: LocatorStrategy.CSS,
    value: 'textarea[placeholder="Enter Here"]'
  };

  readonly SAVE_CHANGES_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Save Changes")'
  };

  readonly CANCEL_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Cancel")'
  };
}
