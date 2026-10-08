// pages/userManagement.ts

import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { UserManagementLocators } from '../locators/userManagementObjects';
import { Assertions } from '../utils/assertions';
import { RuntimeData } from '../types';
import { Actions } from '../utils/actions';
import { TopBarPage } from './topBarPage';
import { NetworkWait } from '../utils/networkWait';
import { getLogger } from '../core/logger';

const logger = getLogger('user-management-page');

/**
 * User Management Page Object
 */
export class UserManagement extends BasePage {

  private locators: UserManagementLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new UserManagementLocators();
  }

  /**
   * Verify User Management page is visible
   */
  async verifyUserManagementPageVisible(): Promise<void> {

    const topBarPage = new TopBarPage(
      this.page,
      this.runtimeData
    );

    await topBarPage.verifyPageTitle('User Management');
  }

  /**
 * Click Add User button
 */
  async clickAddUser(): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.ADD_USER_BUTTON
    );
  }

  /**
 * Search user by email
 */
  async searchByEmail(email: string): Promise<void> {
    logger.info(`Searching for user: ${email}`);
    await Actions.type(
      this.page,
      this.locators.SEARCH_EMAIL_INPUT,
      email
    );

    await NetworkWait.waitForApiResponseWithQuery(
      this.page,
      '/api/v1/users/',
      'email',
      8000
    );
  }

  /**
   * Verify user exists in table
   */
  async verifyUserExists(email: string): Promise<void> {
    await Assertions.verifyElementVisible(
      this.page,
      this.locators.userRowByEmail(email)
    );
    logger.info(`User found: ${email}`);
  }

  /**
   * Verify user does not exist in table
   */
  async verifyUserNotExists(email: string): Promise<void> {
    const isVisible = await Actions.isVisible(
      this.page,
      this.locators.userRowByEmail(email)
    );
    if (isVisible) {
      throw new Error(` User still exists: ${email}`);
    }
    logger.info(`User not found: ${email}`);
  }

  /**
   * Delete user by email
   */
  async deleteUserByEmail(email: string): Promise<void> {
    // Click delete button in user row
    await Actions.click(
      this.page,
      this.locators.deleteButtonByEmail(email)
    );
    // Confirm deletion
    await Actions.click(
      this.page,
      this.locators.CONFIRM_DELETE_BUTTON
    );
    logger.info(`User deleted: ${email}`);
  }

  /**
   * Click edit button for user by email
   */
  async editUserByEmail(email: string): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.editButtonByEmail(email)
    );
  }

  async verifyNameInTable(
    email: string,
    expectedName: string
  ): Promise<void> {

    const locator = Actions.resolve(
      this.page,
      this.locators.userNameByEmail(email)
    );

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.userNameByEmail(email)
    );

    const actualName = await locator.innerText();

    if (!actualName.trim().includes(expectedName.trim())) {
      throw new Error(
        `Expected name "${expectedName}" but found "${actualName}" for email: ${email}`
      );
    }

    logger.info(`Updated name verified: ${actualName}`);
  }

  /**
   * Deactivate user by email
   */
  async deactivateUserByEmail(email: string): Promise<void> {
    const toggle = Actions.resolve(
      this.page,
      this.locators.toggleSwitchByEmail(email)
    );

    await toggle.waitFor({ state: 'visible', timeout: 10000 });

    // Only deactivate if currently active
    const isChecked = await toggle.isChecked();
    if (!isChecked) {
      throw new Error(`User ${email} is already inactive`);
    }

    // Click toggle to open confirmation modal
    await toggle.click();

    // Click Deactivate in modal
    await Actions.click(
      this.page,
      this.locators.CONFIRM_DEACTIVATE_BUTTON
    );

    logger.info(`User deactivated: ${email}`);
  }

  /**
   * Activate user by email
   */
  async activateUserByEmail(email: string): Promise<void> {
    const toggle = Actions.resolve(
      this.page,
      this.locators.toggleSwitchByEmail(email)
    );

    await toggle.waitFor({ state: 'visible', timeout: 10000 });

    // Only activate if currently inactive
    const isChecked = await toggle.isChecked();
    if (isChecked) {
      throw new Error(`User ${email} is already active`);
    }

    await toggle.click();
    logger.info(`User activated: ${email}`);
  }

  /**
   * Verify user status in table
   */
  async verifyUserStatus(
    email: string,
    expectedStatus: 'Active' | 'Inactive'
  ): Promise<void> {
    const locator = Actions.resolve(
      this.page,
      this.locators.userStatusByEmail(email)
    );

    await locator.waitFor({ state: 'visible', timeout: 10000 });

    const actualStatus = await locator.innerText();

    if (!actualStatus.trim().includes(expectedStatus)) {
      throw new Error(
        `Expected status "${expectedStatus}" but found "${actualStatus}" for email: ${email}`
      );
    }

    logger.info(`User status verified: ${actualStatus} for ${email}`);
  }

  /**
  * Click Cancel button to abandon user creation
  */
  async clickCancel(): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.CANCEL_BUTTON
    );
    logger.info('Add User form cancelled');
  }

  /**
   * Click Status filter dropdown
   */
  async clickStatusFilterDropdown(): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.STATUS_FILTER_DROPDOWN
    );
  }

  /**
   * Select a status from the filter dropdown
   */
  async selectStatusFilter(status: string): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.statusFilterOptionByName(status)
    );

    // Let any table refresh (API call or re-render) settle before we read rows
    await this.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {
      // Some apps keep long-lived connections open (websockets, polling) that
      // never go idle — don't fail the step just because of that.
    });

    logger.info(`Status filter applied: ${status}`);
  }
  /**
   * Verify every visible user row matches the expected status
   */
  async verifyAllUsersHaveStatus(
    expectedStatus: 'Active' | 'Inactive'
  ): Promise<void> {
    const badges = this.page.locator(
      this.locators.ALL_STATUS_BADGES.value
    );

    const count = await badges.count();

    if (count === 0) {
      logger.info(`No users found with status "${expectedStatus}" — filter returned an empty result set.`);
      return;
    }

    for (let i = 0; i < count; i++) {
      const text = await badges.nth(i).innerText();
      if (!text.trim().includes(expectedStatus)) {
        throw new Error(
          `Expected all users to have status "${expectedStatus}" but found "${text}" at row ${i + 1}`
        );
      }
    }

    logger.info(`All ${count} users verified with status: ${expectedStatus}`);
  }
}
