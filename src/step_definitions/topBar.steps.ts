import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { TopBarPage } from '../pages/topBarPage';

/**
 * Verify TopBar visible
 */
Then(
  'the topbar should be visible',
  async function (this: CustomWorld) {

    const topBarPage = new TopBarPage(
      this.page!,
      this.runtimeData
    );

    await topBarPage.verifyTopBarVisible();
  }
);

/**
 * Verify page title
 */
Then(
  'I should see page title {string}',
  async function (
    this: CustomWorld,
    title: string
  ) {

    const topBarPage = new TopBarPage(
      this.page!,
      this.runtimeData
    );

    await topBarPage.verifyPageTitle(title);
  }
);

/**
 * Click notification button
 */
When(
  'I click notification button',
  async function (this: CustomWorld) {

    const topBarPage = new TopBarPage(
      this.page!,
      this.runtimeData
    );

    await topBarPage.clickNotificationButton();
  }
);

/**
 * Click user menu
 */
When(
  'I click user menu',
  async function (this: CustomWorld) {

    const topBarPage = new TopBarPage(
      this.page!,
      this.runtimeData
    );

    await topBarPage.clickUserMenu();
  }
);

/**
 * Search from topbar
 */
When(
  'I search for {string} from topbar',
  async function (
    this: CustomWorld,
    value: string
  ) {

    const topBarPage = new TopBarPage(
      this.page!,
      this.runtimeData
    );

    await topBarPage.search(value);
  }
);
When(
  'I click Account Settings',
  async function (this: CustomWorld) {

    const topBarPage = new TopBarPage(
      this.page!,
      this.runtimeData
    );

    await topBarPage.clickUserMenu();

    await topBarPage.clickAccountSettings();
  }
);

/**
 * Open user menu and click Logout
 */
When(
  'I click Logout',
  async function (this: CustomWorld) {

    const topBarPage = new TopBarPage(
      this.page!,
      this.runtimeData
    );

    await topBarPage.clickUserMenu();

    await topBarPage.clickLogout();
  }
); 
