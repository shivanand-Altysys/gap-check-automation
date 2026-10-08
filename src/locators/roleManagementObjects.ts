import { LocatorStrategy } from '../core/locatorStrategy';
import { CSSLocator, XPathLocator } from '../types';

export class RoleManagementLocators {
  readonly ADD_ROLE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Add Role")'
  };

  readonly ROLE_NAME_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[placeholder="e.g. Country Manager"]'
  };

  readonly ROLE_DESCRIPTION_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'textarea[placeholder="Short description of the role\'s purpose"]'
  };

  readonly CREATE_ROLE_SAVE_BUTTON: XPathLocator = {
    strategy: LocatorStrategy.XPATH,
    value: '//div[contains(@role, "dialog") or contains(@class, "modal")]//button[normalize-space()="Save"] | //button[normalize-space()="Save" and not(ancestor::main)]'
  };

  readonly DELETE_ROLE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button:has-text("Delete Role")'
  };

  readonly CONFIRM_DELETE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="confirm-dialog-confirm"]'
  };


  roleTab(roleName: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//button[normalize-space()="${roleName}"]`
    };
  }

  // NEW — matches whichever tab is currently active/selected
  readonly ACTIVE_TAB: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.tab-control__tab--active'
  };

  // NEW — matches the active tab only when it also has a specific role name
  activeRoleTab(roleName: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//button[contains(@class,"tab-control__tab--active") and @aria-selected="true" and normalize-space()="${roleName}"]`
    };
  }

  readonly ENTITY_DROPDOWN: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[data-testid="entity-select"]'
  };

  entityOption(entity: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//*[normalize-space()="${entity}"]`
    };
  }

  readonly PERMISSION_CHECKBOXES: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="checkbox"]'
  };

  readonly ROLE_NAME_ERROR: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.pill-input-wrapper.is-error'
  };

  // Matches a single permission checkbox via its accessible label
  permissionCheckbox(entity: string, permission: string): CSSLocator {
    return {
      strategy: LocatorStrategy.CSS,
      value: `input[aria-label="${entity} – ${permission}"]`
    };
  }

  // Matches the clickable label wrapping a permission checkbox via its accessible label
  permissionCheckboxLabel(entity: string, permission: string): XPathLocator {
    return {
      strategy: LocatorStrategy.XPATH,
      value: `//input[@aria-label="${entity} – ${permission}"]/ancestor::label[contains(@class,"app-checkbox")]`
    };
  }

  // Save button in the permissions matrix footer (distinct from the Create Role modal's Save)
  readonly PERMISSIONS_SAVE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.roles-card__actions button:has-text("Save")'
  };

}

export const roleManagementObjects = {
  addRoleButton: 'button:has-text("Add Role")',
  createRoleDialog: '[aria-label="Create Role"]',
  roleNameInput: 'input[placeholder="e.g. Country Manager"]',
  entityDropdown: '[data-testid="entity-select"]',
  descriptionInput: 'textarea[placeholder="Short description of the role\'s purpose"]',
  saveButton: 'button:has-text("Save")',
  activeTab: '.tab-control__tab--active', // NEW
  roleTitle: 'h1',
  permissionCheckboxes: 'input[type="checkbox"]'
};