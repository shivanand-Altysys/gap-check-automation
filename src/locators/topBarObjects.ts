import { LocatorStrategy } from '../core/locatorStrategy';

export class TopBarLocators {

  /**
   * Topbar Container
   */
  readonly TOPBAR_CONTAINER = {
    strategy: LocatorStrategy.CSS,
    value: 'div.topbar-inner'
  };

  /**
   * Page Title
   */
  readonly PAGE_TITLE = {
    strategy: LocatorStrategy.CSS,
    value: 'h1.topbar-title'
  };

  /**
   * Search Input
   */
  readonly SEARCH_INPUT = {
    strategy: LocatorStrategy.CSS,
    value: 'input.search-input'
  };

  /**
   * Notifications Button
   */
  readonly NOTIFICATION_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button.notif-btn'
  };

  /**
   * User Menu Button
   */
  readonly USER_MENU_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button.user-btn'
  };

  /**
   * Logged In Username
   */
  readonly USER_NAME = {
    strategy: LocatorStrategy.CSS,
    value: 'span.user-name'
  };

  /**
   * Mobile Hamburger Menu
   */
  readonly HAMBURGER_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button.topbar-hamburger'
  };

    readonly ACCOUNT_SETTINGS_OPTION = {
    strategy: LocatorStrategy.CSS,
    value: 'a.profile-dd-item:text("Account Settings")'
    };

  /**
   * Logout button
   */
  readonly LOGOUT_BUTTON = {
    strategy: LocatorStrategy.CSS,
    value: 'button.profile-dd-logout'
  };
}