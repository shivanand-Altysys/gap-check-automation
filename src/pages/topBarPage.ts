import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { TopBarLocators } from '../locators/topBarObjects';
import { Actions } from '../utils/actions';
import { Assertions } from '../utils/assertions';
import { RuntimeData } from '../types';

/**
 * TopBar Page Object
 */
export class TopBarPage extends BasePage {

  private locators: TopBarLocators;

  constructor(
    page: Page,
    runtimeData: RuntimeData
  ) {

    super(page, runtimeData);

    this.locators = new TopBarLocators();
  }

  /**
   * Verify TopBar is visible
   */
  async verifyTopBarVisible(): Promise<void> {

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.TOPBAR_CONTAINER
    );
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(
    expectedTitle: string
  ): Promise<void> {

    await Assertions.verifyText(
      this.page,
      this.locators.PAGE_TITLE,
      expectedTitle
    );
  }

  /**
   * Click notification button
   */
  async clickNotificationButton(): Promise<void> {

    await Actions.click(
      this.page,
      this.locators.NOTIFICATION_BUTTON
    );
  }

  /**
   * Click user menu
   */
  async clickUserMenu(): Promise<void> {

    await Actions.click(
      this.page,
      this.locators.USER_MENU_BUTTON
    );
  }

  /**
   * Search from topbar
   */
  async search(
    value: string
  ): Promise<void> {

    await Actions.type(
      this.page,
      this.locators.SEARCH_INPUT,
      value
    );
  }

  /**
   * Verify logged in username
   */
  async verifyLoggedInUser(
    expectedUser: string
  ): Promise<void> {

    await Assertions.verifyText(
      this.page,
      this.locators.USER_NAME,
      expectedUser
    );
  }

    /**
     * Click Account Settings
     */
    async clickAccountSettings(): Promise<void> {

    await Actions.click(
        this.page,
        this.locators.ACCOUNT_SETTINGS_OPTION
    );
    }

    /**
     * Click Logout
     */
    async clickLogout(): Promise<void> {

    await Actions.click(
        this.page,
        this.locators.LOGOUT_BUTTON
    );
    }
}