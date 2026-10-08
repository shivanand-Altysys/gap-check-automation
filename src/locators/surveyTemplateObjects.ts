import { LocatorStrategy } from '../core/locatorStrategy';
import { CSSLocator, XPathLocator } from '../types';

export class SurveyTemplatesLocators {
  readonly ADD_TEMPLATE_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Add Template")'
  };

  readonly TEMPLATES_TABLE_ROWS = {
    strategy: LocatorStrategy.CSS,
    value: 'table tbody tr'
  };

  readonly SEARCH_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="Search"]'
  };

  templateRowByName(name: string) {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[td[normalize-space()="${name}"]]`
    };
  }

  editButtonByTemplateName(name: string) {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[td[normalize-space()="${name}"]]//button[@aria-label="Edit row"]`
    };
  }

  builderButtonByTemplateName(name: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[td[normalize-space()="${name}"]]//button[@aria-label="Open row in form builder"]`
    };
  }

  deleteButtonByTemplateName(name: string) {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[td[normalize-space()="${name}"]]//button[@aria-label="Delete row"]`
    };
  }

  statusBadgeByTemplateName(name: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[td[normalize-space()="${name}"]]//span[contains(concat(" ", normalize-space(@class), " "), " badge ")]`
    };
  }

  // Publishing a new version keeps the original name, so multiple rows can share a name and are
  // distinguished by their version cell (e.g. "v27" vs "v28").
  templateRowByNameAndVersion(name: string, version: number): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[td[normalize-space()="${name}"] and td[normalize-space()="v${version}"]]`
    };
  }

  statusBadgeByNameAndVersion(name: string, version: number): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//tr[td[normalize-space()="${name}"] and td[normalize-space()="v${version}"]]//span[contains(concat(" ", normalize-space(@class), " "), " badge ")]`
    };
  }

  readonly CONFIRM_DELETE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]'
  };
}
