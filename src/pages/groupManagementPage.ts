import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { GroupManagementLocators } from '../locators/groupManagementObjects';
import { Actions } from '../utils/actions';
import { Assertions } from '../utils/assertions';
import { RuntimeData, GroupData } from '../types';
import { TopBarPage } from './topBarPage';
import { NetworkWait } from '../utils/networkWait';
import { getLogger } from '../core/logger';

const logger = getLogger('group-management-page');

export class GroupManagementPage extends BasePage {
  private locators: GroupManagementLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new GroupManagementLocators();
  }

  async verifyGroupManagementPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(this.page, this.runtimeData);
    await topBarPage.verifyPageTitle('Group Management');
  }

  async clickAddGroup(): Promise<void> {
    await Actions.click(this.page, this.locators.ADD_GROUP_BUTTON);
  }

  async verifyAddGroupPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(this.page, this.runtimeData);
    await topBarPage.verifyPageTitle('Add Group');
  }

  async fillGroupName(name: string): Promise<void> {
    await Actions.type(this.page, this.locators.GROUP_NAME_INPUT, name);
  }

  async createGroup(group: GroupData): Promise<void> {
    await Actions.type(this.page, this.locators.GROUP_NAME_INPUT, group.name);
    await this.selectDropdownOption(this.locators.ROLE_SELECT, group.roleName);
    await this.selectDropdownOption(this.locators.DOMAIN_SELECT, group.domain);
    await Actions.click(this.page, this.locators.ADD_ROW_BUTTON);
    await Assertions.verifyElementVisible(this.page, this.locators.groupRow(group.roleName), 10000);
    await Actions.click(this.page, this.locators.SAVE_GROUP_BUTTON);
    logger.info(`Group created: ${group.name}`);
  }

  async searchGroupByName(groupName: string): Promise<void> {
    await Actions.type(this.page, this.locators.SEARCH_GROUP_INPUT, groupName);
    await NetworkWait.waitForNetworkIdle(this.page, 3000);
  }

  async verifyGroupExists(groupName: string): Promise<void> {
    await Assertions.verifyElementVisible(this.page, this.locators.groupRow(groupName), 10000);
  }

  async verifyGroupAbsent(groupName: string): Promise<void> {
    const row = Actions.resolve(this.page, this.locators.groupRow(groupName));
    await row.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async clickCancelButton(): Promise<void> {
    await Actions.click(this.page, this.locators.CANCEL_BUTTON);
  }

  async getAssignmentCount(groupName: string): Promise<number> {
    const badge = Actions.resolve(this.page, this.locators.assignmentCountBadge(groupName));
    await badge.waitFor({ state: 'visible', timeout: 10000 });

    const text = (await badge.textContent())?.trim() ?? '';
    const match = text.match(/^(\d+)/);
    if (!match) {
      throw new Error(`Could not parse assignment count from badge text "${text}"`);
    }
    return Number(match[1]);
  }

  async verifyAssignmentCount(groupName: string, expectedCount: number): Promise<void> {
    const actualCount = await this.getAssignmentCount(groupName);
    if (actualCount !== expectedCount) {
      throw new Error(
        `Expected assignment count ${expectedCount} for group "${groupName}" but found ${actualCount}`,
      );
    }
  }

  async verifyAlertDialogTitle(expectedTitle: string): Promise<void> {
    await Assertions.verifyText(this.page, this.locators.ALERT_DIALOG_TITLE, expectedTitle);
  }

  async verifyAlertDialogMessageContains(expectedText: string): Promise<void> {
    await Assertions.verifyTextContains(this.page, this.locators.ALERT_DIALOG_MESSAGE, expectedText);
  }

  async verifyAlertDialogListsUser(email: string): Promise<void> {
    const item = Actions.resolve(this.page, this.locators.alertDialogListItem(email));
    await item.waitFor({ state: 'visible', timeout: 10000 });
  }

  async dismissAlertDialog(): Promise<void> {
    await Actions.click(this.page, this.locators.ALERT_DIALOG_DISMISS_BUTTON);
    await Actions.resolve(this.page, this.locators.ALERT_DIALOG_TITLE).waitFor({
      state: 'hidden',
      timeout: 5000,
    });
  }

  async deleteGroup(groupName: string): Promise<void> {
    await Actions.click(this.page, this.locators.deleteButtonByGroupName(groupName));
    await Actions.click(this.page, this.locators.CONFIRM_DELETE_BUTTON);
    logger.info(`Group deleted: ${groupName}`);
  }

  async clickEditForGroup(groupName: string): Promise<void> {
    await Actions.click(this.page, this.locators.editButtonByGroupName(groupName));
  }

  async verifyEditGroupPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(this.page, this.runtimeData);
    await topBarPage.verifyPageTitle('Edit Group');
  }

  async updateGroupName(newName: string): Promise<void> {
    await Actions.clear(this.page, this.locators.GROUP_NAME_INPUT);
    await Actions.type(this.page, this.locators.GROUP_NAME_INPUT, newName);
  }

  async getGroupNameFieldValue(): Promise<string | null> {
    const input = Actions.resolve(this.page, this.locators.GROUP_NAME_INPUT);
    await input.waitFor({ state: 'visible', timeout: 10000 });
    return input.inputValue();
  }

  async selectRole(role: string): Promise<void> {
    await this.selectDropdownOption(this.locators.ROLE_SELECT, role);
  }

  async selectDomain(domain: string): Promise<void> {
    await this.selectDropdownOption(this.locators.DOMAIN_SELECT, domain);
  }

  async selectCountry(country: string): Promise<void> {
    if (country !== 'Global') {
      await this.selectCountryOption(country);
    }
  }

  async clickAddRow(): Promise<void> {
    await Actions.click(this.page, this.locators.ADD_ROW_BUTTON);
  }

  async clickSaveGroup(): Promise<void> {
    await Actions.click(this.page, this.locators.SAVE_GROUP_BUTTON);
  }

  async verifyValidationMessages(expectedMessages: string[]): Promise<void> {
    await Assertions.verifyTexts(this.page, this.locators.VALIDATION_MESSAGES, expectedMessages);
  }

  async verifyGroupNameFieldHighlighted(): Promise<void> {
    const wrapper = Actions.resolve(this.page, this.locators.GROUP_NAME_ERROR_WRAPPER);
    await wrapper.waitFor({ state: 'visible', timeout: 10000 });

    const classes = (await wrapper.getAttribute('class')) ?? '';
    if (!classes.includes('is-error')) {
      throw new Error(`Expected Group Name field to be highlighted with an error state but found class "${classes}"`);
    }
  }

  async verifyNoCombinationsAdded(): Promise<void> {
    await Assertions.verifyElementVisible(this.page, this.locators.EMPTY_COMBINATIONS_ROW, 10000);
  }

  async verifyCombinationCount(role: string, domain: string, country: string, expectedCount: number): Promise<void> {
    const rows = Actions.resolve(this.page, this.locators.combinationRow(role, domain, country));
    await rows.first().waitFor({ state: 'visible', timeout: 10000 });

    const actualCount = await rows.count();
    if (actualCount !== expectedCount) {
      throw new Error(
        `Expected ${expectedCount} combination row(s) for ${role} / ${domain} / ${country} but found ${actualCount}`,
      );
    }
  }

  async addCombination(role: string, domain: string, country: string): Promise<void> {
    await this.selectDropdownOption(this.locators.ROLE_SELECT, role);
    await this.selectDropdownOption(this.locators.DOMAIN_SELECT, domain);

    if (country !== 'Global') {
      await this.selectCountryOption(country);
    }

    await Actions.click(this.page, this.locators.ADD_ROW_BUTTON);
    await Assertions.verifyElementVisible(
      this.page,
      this.locators.combinationRow(role, domain, country),
      10000,
    );
  }

  async saveGroupChanges(): Promise<void> {
  // Wait for any remaining dialogs to disappear
  try {
    await this.page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 5000 });
  } catch (error) {}

  await Actions.click(this.page, this.locators.SAVE_CHANGES_BUTTON);
}

  async verifyCombinationPresent(role: string, domain: string, country: string): Promise<void> {
    await Assertions.verifyElementVisible(
      this.page,
      this.locators.combinationRow(role, domain, country),
      10000,
    );
  }

  async verifyCombinationAbsent(role: string, domain: string, country: string): Promise<void> {
    const locator = this.locators.combinationRow(role, domain, country);
    const row = Actions.resolve(this.page, locator);
    await row.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async removeCombination(roleName: string, domain: string, country: string): Promise<void> {
  logger.info(`Removing combination: ${roleName}, ${domain}, ${country}`);

  // Get the button to click
  const combinationRow = this.locators.combinationRow(roleName, domain, country);
  const removeButton = this.locators.removeCombinationButtonByRow(roleName, domain, country);

  // Click it - with type safety workaround
  try {
    await Actions.click(this.page, removeButton as any);
  } catch (error) {
    // Fallback to direct Playwright selector
    const rowXPath = `//tr[contains(., "${roleName}") and contains(., "${domain}") and contains(., "${country}")]`;
    await this.page.locator(`xpath=${rowXPath}`).locator('button[aria-label="Delete row"]').click();
  }

  logger.info('Delete button clicked');

  // Handle confirmation dialog
  const confirmButton = this.page.locator('[role="dialog"] button:has-text("Remove")');
  
  try {
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    logger.info('Confirmation dialog appeared');
    
    await confirmButton.click();
    logger.info('Remove confirmed');
    
    await this.page.locator('[role="dialog"]').waitFor({ state: 'hidden', timeout: 3000 });
    logger.info('Dialog closed');
  } catch (error) {
    logger.warn( `Confirmation dialog did not appear or was already closed: ${error}`);
  }

  logger.info(`Combination removed: ${roleName}, ${domain}, ${country}`);
}

  private async selectDropdownOption(dropdown: ReturnType<GroupManagementLocators['optionByText']>, optionText: string): Promise<void> {
    await Actions.click(this.page, dropdown);

    const option = Actions.resolve(this.page, this.locators.optionByText(optionText)).last();
    await option.waitFor({ state: 'visible', timeout: 30000 });
    await option.click();
  }

  private async selectCountryOption(country: string): Promise<void> {
    await Actions.click(this.page, this.locators.COUNTRY_SELECT);

    const searchInput = Actions.resolve(this.page, this.locators.COUNTRY_SEARCH_INPUT);
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill(country);

    const option = Actions.resolve(this.page, this.locators.COUNTRY_OPTION_ITEMS)
      .filter({ hasText: country })
      .first();
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();

    // Multi-select mode keeps the panel open after a pick (unlike the old
    // single-select behaviour), so close it explicitly before continuing.
    await this.page.keyboard.press('Escape');
  }
}
