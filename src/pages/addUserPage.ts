// pages/addUserPage.ts

import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { AddUserLocators } from '../locators/addUserObjects';
import { Actions } from '../utils/actions';
import { RuntimeData, UserData } from '../types';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { TopBarPage } from './topBarPage';
import { Assertions } from '../utils/assertions';

/**
 * Add User Page Object
 */
export class AddUserPage extends BasePage {

  private locators: AddUserLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new AddUserLocators();
  }

  /**
   * Verify Add User page is visible
   */
  async verifyAddUserPageVisible(): Promise<void> {

    const topBarPage = new TopBarPage(
      this.page,
      this.runtimeData
    );

    await topBarPage.verifyPageTitle('Add User');
  }

  /**
   * Fill Full Name
   */
  async fillFullName(fullName: string): Promise<void> {

    await Actions.type(
      this.page,
      this.locators.FULL_NAME_INPUT,
      fullName
    );
  }

  /**
   * Fill Email
   */
  async fillEmail(email?: string): Promise<void> {

    await Actions.type(
      this.page,
      this.locators.EMAIL_INPUT,
      email ?? ''
    );
  }

  /**
   * Fill Password
   */
  async fillPassword(password: string): Promise<void> {

    await Actions.type(
      this.page,
      this.locators.PASSWORD_INPUT,
      password
    );

    await this.page.keyboard.press('Tab');
  }

  /**
   * Select groups for the user
   */
  async selectGroups(groups: string[]): Promise<void> {

    const groupNames = groups
      .map(group => group.trim())
      .filter(Boolean);

    if (groupNames.length === 0) {
      return;
    }

    await Actions.click(
      this.page,
      this.locators.GROUPS_CONTROL
    );

    const searchInput = Actions.resolve(
      this.page,
      this.locators.GROUPS_SEARCH_INPUT
    );

    await searchInput.waitFor({ state: 'visible', timeout: 30000 });

    for (const group of groupNames) {
      await searchInput.fill(group);

      const option = Actions.resolve(
        this.page,
        this.locators.GROUP_OPTIONS
      ).filter({ hasText: group }).first();

      await option.waitFor({ state: 'visible', timeout: 30000 });

      const isSelected = await option.getAttribute('aria-selected');

      if (isSelected !== 'true') {
        await option.click();
      }
    }

    await Actions.click(
      this.page,
      this.locators.GROUPS_CONTROL
    );
  }

  /**
   * Click Save User
   */
  async clickSaveUser(): Promise<void> {

    await Actions.click(
      this.page,
      this.locators.SAVE_USER_BUTTON
    );
  }

  /**
   * Fill complete user form
   */
  async fillUserForm(user: UserData): Promise<void> {

    await this.fillFullName(user.fullName);

    await this.fillEmail(user.email);

    await this.fillPassword(user.password);

    await this.selectGroups(user.groups || ['admin']);
  }

  /**
   * Create new user
   */
  async createUser(
    overrides: Partial<UserData> = {}
  ): Promise<UserData> {

    const user = TestDataGenerator.user(overrides);

    await this.fillUserForm(user);

    await this.clickSaveUser();

    return user;
  }

  /**
   * Verify validation messages
   */
  async verifyValidationMessages(
    expectedMessages: string[]
  ): Promise<void> {

    await Assertions.verifyTexts(
      this.page,
      this.locators.VALIDATION_MESSAGES,
      expectedMessages
    );
  }

  /**
   * Click Cancel button
   */
  async clickCancel(): Promise<void> {

    await Actions.click(
      this.page,
      this.locators.CANCEL_BUTTON
    );
  }
}
