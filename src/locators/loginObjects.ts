import { LocatorStrategy } from '../core/locatorStrategy';
import { CSSLocator, RoleLocator, TextLocator, XPathLocator } from '../types';

/**
 * Login Locators
 * Centralizes all UI element locators for the Login page
 * Uses strategy pattern for flexible locator resolution
 */
export class LoginLocators {
  readonly USERNAME_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="email"]',
  };

  readonly PASSWORD_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="password"]',
  };

  readonly LOGIN_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'form button[type="submit"]',
  };

  readonly REMEMBER_ME_CHECKBOX: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="checkbox"][name="rememberMe"], input[type="checkbox"]',
  };

  readonly COMPLETE_PROFILE_TITLE: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'h1.profile-form__title',
  };

  readonly ERROR_MESSAGE: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'p.text-error',
  };

  readonly FORGOT_PASSWORD_LINK: TextLocator = {
    strategy: LocatorStrategy.TEXT,
    value: 'Forgot Password?',
  };

  readonly CREATE_ACCOUNT_LINK: TextLocator = {
    strategy: LocatorStrategy.TEXT,
    value: 'Create Account',
  };

  readonly CREATE_ACCOUNT_TITLE: TextLocator = {
    strategy: LocatorStrategy.TEXT,
    value: 'Create New Account',
  };

  readonly CREATE_ACCOUNT_EMAIL_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="email"]',
  };

  readonly CREATE_ACCOUNT_PASSWORD_INPUT: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="password"]',
  };

  readonly TERMS_CHECKBOX: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'input[type="checkbox"]',
  };

  readonly CREATE_NOW_BUTTON: RoleLocator = {
    strategy: LocatorStrategy.ROLE,
    role: 'button',
    value: 'Create Now',
  };

  readonly FORGOT_PASSWORD_TITLE: TextLocator = {
    strategy: LocatorStrategy.TEXT,
    value: 'Forgot Password',
  };

  readonly SUBMIT_BUTTON: RoleLocator = {
    strategy: LocatorStrategy.ROLE,
    role: 'button',
    value: 'Submit',
  };

  readonly RESET_EMAIL_SUCCESS_MSG: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'p.text-row-text.text-center',
  };

  // Change Password Page
  readonly CHANGE_PASSWORD_TITLE: TextLocator = {
    strategy: LocatorStrategy.TEXT,
    value: 'Change Password'
  };

  readonly NEW_PASSWORD_INPUT: XPathLocator = {
    strategy: LocatorStrategy.XPATH,
    value: '//label[contains(text(),"New Password")]/following::input[@type="password"][1]'
  };

  readonly CONFIRM_PASSWORD_INPUT: XPathLocator = {
    strategy: LocatorStrategy.XPATH,
    value: '//label[contains(text(),"Confirm Password")]/following::input[@type="password"][1]'
  };

  readonly SET_NEW_PASSWORD_BUTTON: RoleLocator = {
    strategy: LocatorStrategy.ROLE,
    role: 'button',
    value: 'Set New Password'
  };
}
