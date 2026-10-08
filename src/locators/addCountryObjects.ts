// locators/addCountryObjects.ts

import { LocatorStrategy } from '../core/locatorStrategy';
import { CSSLocator } from '../types';

export class AddCountryLocators {

  readonly TITLE_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="e.g. France"]',
  };

  readonly SLUG_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="e.g. france"]',
  };

  readonly ISO_NUMERIC_CODE_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="e.g. 250"]',
  };

  readonly ADMINISTRATIVE_DIVISION_ID_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="e.g. FR-IDF"]',
  };

  readonly CBA_BROWSER_TITLE_TEMPLATE_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'textarea[placeholder="e.g. Collective bargaining agreements in {country}"]',
  };

  readonly CBA_BROWSER_DESCRIPTION_TEMPLATE_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'textarea[placeholder="Description shown on the CBA browser landing page"]',
  };

  readonly SAVE_COUNTRY_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button[type="submit"]:has-text("Save Country")',
  };

  readonly VALIDATION_MESSAGES: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'p.text-error',
  };
}
