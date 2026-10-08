import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { EditUserLocators } from '../locators/editUserObjects';
import { Actions } from '../utils/actions';
import { RuntimeData } from '../types';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { TopBarPage } from './topBarPage';

export class EditUserPage extends BasePage {

  private locators: EditUserLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new EditUserLocators();
  }

  /**
   * Verify Edit User page is visible
   */
  async verifyEditUserPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(
      this.page,
      this.runtimeData
    );
    await topBarPage.verifyPageTitle('Edit User');
  }

  /**
   * Clear and fill Full Name
   */
  async fillFullName(fullName: string): Promise<void> {
    await Actions.clear(
      this.page,
      this.locators.FULL_NAME_INPUT
    );
    await Actions.type(
      this.page,
      this.locators.FULL_NAME_INPUT,
      fullName
    );
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
   * Click Save Changes button
   */
  async clickSaveChanges(): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.SAVE_CHANGES_BUTTON
    );
  }

  /**
   * Update user full name and save
   * Stores updated name in runtimeData
   */
  async updateUser(): Promise<string> {
    const updatedName = TestDataGenerator.generateValidFullName();

    await this.fillFullName(updatedName);
    await this.clickSaveChanges();

    return updatedName;
  }

}
