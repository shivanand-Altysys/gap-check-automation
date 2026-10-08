import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { RoleManagementLocators, roleManagementObjects } from '../locators/roleManagementObjects';
import { Actions } from '../utils/actions';
import { Assertions } from '../utils/assertions';
import { RuntimeData, RoleData } from '../types';
import { TopBarPage } from './topBarPage';
import { getLogger } from '../core/logger';
import { expect } from "@playwright/test";

const logger = getLogger('role-management-page');

export class RoleManagementPage extends BasePage {
  private locators: RoleManagementLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new RoleManagementLocators();
  }

  async verifyRoleManagementPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(this.page, this.runtimeData);
    await topBarPage.verifyPageTitle('Roles');
  }

  async createRole(role: RoleData): Promise<void> {
    await Actions.click(this.page, this.locators.ADD_ROLE_BUTTON);

    await Actions.type(
      this.page,
      this.locators.ROLE_NAME_INPUT,
      role.name
    );

    await Actions.type(
      this.page,
      this.locators.ROLE_DESCRIPTION_INPUT,
      role.description
    );

    await Actions.click(
      this.page,
      this.locators.CREATE_ROLE_SAVE_BUTTON
    );

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.activeRoleTab(role.name),
      20000
    );

    // Verify permissions
    await this.verifyPermissionsUnchecked();

    logger.info(`Role created: ${role.name}`);
  }

  async selectRole(roleName: string): Promise<void> {
    await Actions.click(this.page, this.locators.roleTab(roleName));
  }

  async deleteRole(roleName: string): Promise<void> {
    await this.selectRole(roleName);
    await Actions.click(this.page, this.locators.DELETE_ROLE_BUTTON);
    await Actions.click(this.page, this.locators.CONFIRM_DELETE_BUTTON);
    logger.info(`Role deleted: ${roleName}`);
  }

  async clickAddRole() {
    await this.page.locator(roleManagementObjects.addRoleButton).click();
  }

  async enterRoleName(roleName: string) {
    await this.page
      .getByLabel('Create Role')
      .getByPlaceholder('e.g. Country Manager')
      .fill(roleName);
  }

  async selectEntity(entity: string) {
    await this.page.locator(roleManagementObjects.entityDropdown).click();
    await this.page.getByText(entity).click();
  }

  async enterDescription(description: string) {
    await this.page
      .getByLabel('Create Role')
      .getByPlaceholder("Short description of the role's purpose")
      .fill(description);
  }

  async clickSave() {
    await this.page
      .getByLabel('Create Role')
      .getByRole('button', { name: 'Save' })
      .click();
  }

  async verifyRoleNameValidationVisible() {
    await expect(
      this.page.getByLabel('Create Role').locator(this.locators.ROLE_NAME_ERROR.value)
    ).toBeVisible();
  }

  async verifyCreateRoleModalOpen() {
    await expect(this.page.getByLabel('Create Role')).toBeVisible();
  }

  async verifyRoleCreatedAndSelected(roleName: string) {
    await Assertions.verifyElementVisible(
      this.page,
      this.locators.activeRoleTab(roleName),
      20000
    );
  }

  async verifyRoleExists(roleName: string) {
    await Assertions.verifyElementVisible(
      this.page,
      this.locators.roleTab(roleName)
    );
  }

  async togglePermission(entity: string, permission: string) {
    const checkbox = this.page.locator(this.locators.permissionCheckbox(entity, permission).value);
    const label = this.page.locator(this.locators.permissionCheckboxLabel(entity, permission).value);

    if (await checkbox.isChecked()) {
      return; // already in desired state
    }

    // Retry the click up to 3 times in case of a transient miss
    for (let attempt = 1; attempt <= 3; attempt++) {
      await label.click();
      await this.page.waitForTimeout(200); // brief settle time before re-checking

      if (await checkbox.isChecked()) {
        return;
      }

      logger.info(`togglePermission: attempt ${attempt} did not register for "${entity} – ${permission}", retrying`);
    }

    throw new Error(`togglePermission: click on "${entity} – ${permission}" did not take effect after 3 attempts`);
  }
  async verifyPermissionChecked(entity: string, permission: string) {
    await expect(
      this.page.locator(this.locators.permissionCheckbox(entity, permission).value)
    ).toBeChecked();
  }

  async verifyPermissionUnchecked(entity: string, permission: string) {
    await expect(
      this.page.locator(this.locators.permissionCheckbox(entity, permission).value)
    ).not.toBeChecked();
  }

  async clickSavePermissions() {
    const saveButton = this.page.locator(this.locators.PERMISSIONS_SAVE_BUTTON.value);

    const isDisabled = await saveButton.isDisabled();
    if (isDisabled) {
      logger.info('clickSavePermissions: Save button is disabled — no unsaved permission changes detected, skipping click.');
      return;
    }

    const responsePromise = this.page.waitForResponse(
      (res) => ['POST', 'PUT', 'PATCH'].includes(res.request().method()),
      { timeout: 15000 }
    ).catch(() => null);

    await saveButton.click();

    const response = await responsePromise;
    await this.page.waitForTimeout(1000);
  }

  async verifyPermissionsUnchecked(): Promise<void> {
    // Brief buffer in case the permission matrix hasn't finished
    // re-rendering for the newly-active role yet
    await this.page.waitForTimeout(500);

    const checkboxes = this.page.locator(
      this.locators.PERMISSION_CHECKBOXES.value
    );

    const total = await checkboxes.count();

    for (let i = 0; i < total; i++) {
      await expect(checkboxes.nth(i)).not.toBeChecked({ timeout: 15000 });
    }
  }

  async verifyRoleTabCount(roleName: string, expectedCount: number) {
    const count = await this.page.getByRole('tab', { name: roleName, exact: true }).count();
    expect(count).toBe(expectedCount);
  }

  async clickCancel() {
    await this.page
      .getByLabel('Create Role')
      .getByRole('button', { name: 'Cancel' })
      .click();
  }

  async clickDeleteRoleButton() {
    await this.page.locator(this.locators.DELETE_ROLE_BUTTON.value).click();
  }

  async confirmDeletion() {
    await this.page.locator(this.locators.CONFIRM_DELETE_BUTTON.value).click();
  }

  async untogglePermission(entity: string, permission: string) {
    const checkbox = this.page.locator(this.locators.permissionCheckbox(entity, permission).value);
    if (await checkbox.isChecked()) {
      await this.page.locator(this.locators.permissionCheckboxLabel(entity, permission).value).click();
    }
  }

  async deleteRoleIfExists(roleName: string): Promise<void> {
    const tab = this.page.getByRole('tab', { name: roleName, exact: true });

    if (await tab.count() === 0) {
      logger.info(`Cleanup: role "${roleName}" not found — already deleted or never created`);
      return;
    }

    try {
      await this.selectRole(roleName);
      await this.clickDeleteRoleButton();
      await this.confirmDeletion();
      logger.info(`Cleanup: deleted role "${roleName}"`);
    } catch (e) {
      logger.info(`Cleanup: failed to delete role "${roleName}" — ${e}`);
    }
  }

  async deleteAllTrackedRoles(roleNames: string[]): Promise<void> {
    for (const roleName of roleNames) {
      await this.deleteRoleIfExists(roleName);
    }
  }
}
