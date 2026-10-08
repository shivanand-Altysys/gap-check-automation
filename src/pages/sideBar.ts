import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { SidebarLocators } from '../locators/sideBarObjects';
import { Actions } from '../utils/actions';
import { Assertions } from '../utils/assertions';
import { RuntimeData, TextLocator } from '../types';

/**
 * Sidebar Component Page Object
 * Handles all sidebar navigation interactions
 */
export class Sidebar extends BasePage {
  private locators: SidebarLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new SidebarLocators();
  }

  /**
   * Click Dashboard nav item
   */
  async clickDashboard(): Promise<void> {
    await Actions.click(this.page, this.locators.DASHBOARD_NAV);
  }

  /**
   * Click User Role & Administration nav item
   * This expands the submenu
   */
  async clickUserRoleAndAdministration(): Promise<void> {
    await Actions.click(this.page, this.locators.USER_ROLE_NAV);
  }

  async clickAuditLog(): Promise<void> {

  const auditLog =
    this.page.locator(
      this.locators.AUDIT_LOG_NAV.value
    );

  if (!(await auditLog.isVisible())) {

    await Actions.click(
      this.page,
      this.locators.OTHERS_NAV
    );
  }

  await auditLog.waitFor({
    state: 'visible'
  });

  await auditLog.click();
}

  /**
   * Click Country Management nav item
   */
  async clickCountryManagement(): Promise<void> {
    await Actions.click(this.page, this.locators.COUNTRY_MANAGEMENT_NAV);
  }

  /**
   * Click Survey Engine nav item
   */
  async clickSurveyEngine(): Promise<void> {
    await Actions.click(this.page, this.locators.SURVEY_ENGINE_NAV);
  }

  /**
   * Click User Management submenu item
   * Expands User Role & Administration first if needed
   */
  async clickUserManagement(): Promise<void> {
    await this.ensureUserRoleSubmenuOpen();
    await Assertions.verifyElementVisible(this.page,this.locators.USER_MANAGEMENT_SUBMENU);
    await Actions.click(this.page, this.locators.USER_MANAGEMENT_SUBMENU);
  }

  /**
   * Click Role Management submenu item
   * Expands User Role & Administration first if needed
   */
  async clickRoleManagement(): Promise<void> {
    await this.ensureUserRoleSubmenuOpen();
    await Actions.click(this.page, this.locators.ROLE_MANAGEMENT_SUBMENU);
  }

  /**
   * Click Group Management submenu item
   * Click Document Management nav item
   */
  async clickDocumentManagement(): Promise<void> {
    await Actions.click(this.page, this.locators.DOCUMENT_MANAGEMENT_NAV);
  }
   /** Click Group Management submenu item
   * Expands User Role & Administration first if needed
   */
  async clickGroupManagement(): Promise<void> {
    await this.ensureUserRoleSubmenuOpen();
    await Actions.click(this.page, this.locators.GROUP_MANAGEMENT_SUBMENU);
  }

  private async ensureUserRoleSubmenuOpen(): Promise<void> {
    const userManagementVisible = await Actions.isVisible(
      this.page,
      this.locators.USER_MANAGEMENT_SUBMENU
    );

    if (!userManagementVisible) {
      await this.clickUserRoleAndAdministration();
    }
  }

  /**
   * Verify nav item is visible
   */
  async verifyNavItemVisible(navItem: string): Promise<void> {
    const locator: TextLocator = { strategy: 'text', value: navItem };
    await Assertions.verifyElementVisible(this.page, locator);
  }

  /**
   * Verify sidebar is loaded with all main items
   */
  async verifySidebarLoaded(): Promise<void> {
    await Assertions.verifyElementVisible(this.page, this.locators.DASHBOARD_NAV);
    await Assertions.verifyElementVisible(this.page, this.locators.USER_ROLE_NAV);
  }

  /**
   * Verify Dashboard is active nav item
   */
  async verifyDashboardIsActive(): Promise<void> {
    await Assertions.verifyElementVisible(this.page, this.locators.ACTIVE_NAV_ITEM);
  }
}
