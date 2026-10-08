import { AddCountryLocators } from './addCountryObjects';
import { LocatorStrategy } from '../core/locatorStrategy';
import { CSSLocator } from '../types';

export class EditCountryLocators extends AddCountryLocators {
  readonly SAVE_CHANGES_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button[type="submit"]:has-text("Save Changes")',
  };
}
