import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { LoginLocators } from '../locators/loginObjects';
import { Actions } from '../utils/actions';
import { Assertions } from '../utils/assertions';
import { Retry } from '../utils/retry';
import { RuntimeData } from '../types';
import { TopBarPage } from './topBarPage';

/**
 * Login Page Object
 * Extends BasePage with login-specific operations
 * Uses Page Object Model pattern for UI encapsulation
 */
export class LoginPage extends BasePage {
  private locators: LoginLocators;

  /**
   * Initialize LoginPage
   * @param page Playwright Page instance
   * @param runtimeData Shared runtime data across test
   */
  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new LoginLocators();
  }

  /**
   * Navigate to login page with retry logic
   * Handles navigation to blank page first, then target URL
   * @param url Login page URL
   * @throws Error if navigation fails after retries
   */
  async navigateToLoginPage(url: string): Promise<void> {
    await Retry.execute(
      async () => {
        // Navigate to blank page to clear any previous state
        await this.page
          .goto('about:blank', {
            waitUntil: 'load',
            timeout: 10000,
          })
          .catch(() => null);

        // Navigate to actual login page
        await this.page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 90000,
        });

        // Wait for username input to be visible
        await Actions.resolve(this.page, this.locators.USERNAME_INPUT).waitFor({
          state: 'visible',
          timeout: 30000,
        });
      },
      3
    );
  }

  /**
   * Complete login flow - enter username, password, and click login
   * @param username Username/email to login with
   * @param password Password to login with
   */
  async login(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    if (rememberMe) {
      await this.checkRememberMe();
    }
    await this.clickLoginButton();
  }

  /**
   * Check the Remember me checkbox.
   */
  async checkRememberMe(): Promise<void> {
    const checkbox = this.page.locator(this.locators.REMEMBER_ME_CHECKBOX.value).first();
    await checkbox.waitFor({ state: 'visible', timeout: 15000 });
    const isChecked = await checkbox.isChecked();
    if (!isChecked) {
      await checkbox.check();
    }
  }

  /**
   * Enter username into the username input field
   * @param username Username/email to enter
   */
  async enterUsername(username: string): Promise<void> {
    await Actions.type(this.page, this.locators.USERNAME_INPUT, username);
  }

  /**
   * Enter password into the password input field
   * @param password Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await Actions.type(this.page, this.locators.PASSWORD_INPUT, password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await Actions.click(this.page, this.locators.LOGIN_BUTTON);
  }

  /**
   * Verify successful login
   * Checks for dashboard title and redirected URL
   */
  async verifySuccessfulLogin(): Promise<void> {
    await Assertions.verifyUrlContains(this.page, 'complete-profile');
    await Assertions.verifyTextContains(this.page, this.locators.COMPLETE_PROFILE_TITLE, 'Complete Profile');
  }

  /**
   * Verify error message is displayed
   * @param expectedText Expected error message text
   */
  async verifyErrorMessage(expectedText: string): Promise<void> {
    const error = this.page.getByText(expectedText, { exact: true });
    await error.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click the forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await Actions.click(this.page, this.locators.FORGOT_PASSWORD_LINK);
  }

  /**
   * Click Create Account link.
   */
  async clickCreateAccount(): Promise<void> {
   await Actions.click(this.page, this.locators.CREATE_ACCOUNT_LINK);
  }

  /**
   * Verify forgot password page is displayed
   */
  async verifyForgotPasswordPage(): Promise<void> {
   await Assertions.verifyElementVisible(this.page, this.locators.FORGOT_PASSWORD_TITLE);
  }

  /**
   * Verify create account page is displayed.
   */
  async verifyCreateAccountPage(): Promise<void> {
   await Assertions.verifyUrlContains(this.page, 'signup');
   await Assertions.verifyTextContains(this.page, this.locators.CREATE_ACCOUNT_TITLE, 'Create New Account');
  }

  /**
   * Fill signup form email.
   */
  async enterCreateAccountEmail(email: string): Promise<void> {
   await Actions.type(this.page, this.locators.CREATE_ACCOUNT_EMAIL_INPUT, email);
  }

  /**
   * Fill signup password.
   */
  async enterCreateAccountPassword(password: string): Promise<void> {
   const fields = this.page.locator(this.locators.CREATE_ACCOUNT_PASSWORD_INPUT.value);
   await fields.nth(0).waitFor({ state: 'visible', timeout: 10000 });
   await fields.nth(0).fill(password);
  }

  /**
   * Fill signup confirm password.
   */
  async enterConfirmCreateAccountPassword(password: string): Promise<void> {
   const fields = this.page.locator(this.locators.CREATE_ACCOUNT_PASSWORD_INPUT.value);
   await fields.nth(1).waitFor({ state: 'visible', timeout: 10000 });
   await fields.nth(1).fill(password);
  }

  /**
   * Accept terms and conditions.
   */
  async acceptTermsAndConditions(): Promise<void> {
   const checkbox = this.page.locator(this.locators.TERMS_CHECKBOX.value).first();
   await checkbox.check();
  }

  /**
   * Click Create Now button.
   */
  async clickCreateNow(): Promise<void> {
   await Actions.click(this.page, this.locators.CREATE_NOW_BUTTON);
  }

  /**
   * Verify verification email sent message.
   */
  async verifyVerificationEmailSent(email: string): Promise<void> {
   const expectedText = `We've sent a verification link to\n${email}`;
   const element = this.page.getByText('Verify your email to continue', { exact: true });
   await element.waitFor({ state: 'visible', timeout: 10000 });
   const emailLine = this.page.getByText(email, { exact: true });
   await emailLine.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click the submit button
   */
  async clickSubmitButton(): Promise<void> {
    await Actions.click(this.page, this.locators.SUBMIT_BUTTON);
  }

  /**
   * Verify reset email sent message
   * @param email Email address that was used for password reset
   */
  async verifyResetEmailSent(email: string): Promise<void> {
    const expectedText = `Please check your verified email ${email}. We have sent a link to reset your password.`;
    const element = this.page.getByText(expectedText, { exact: true });
    await element.waitFor({ state: 'visible', timeout: 10000 });
  }

    /**
   * Verify change password page is displayed
   */
  async verifyChangePasswordPage(): Promise<void> {
    await Assertions.verifyUrlContains(this.page, 'change-password');
    await Assertions.verifyElementVisible(
      this.page,
      this.locators.CHANGE_PASSWORD_TITLE
    );
  }

  /**
   * Enter new password
   */
  async enterNewPassword(password: string): Promise<void> {
    await Actions.type(
      this.page,
      this.locators.NEW_PASSWORD_INPUT,
      password
    );

    await this.page.keyboard.press('Tab');
  }

  /**
   * Enter confirm password
   */
  async enterConfirmPassword(password: string): Promise<void> {
    await Actions.type(
      this.page,
      this.locators.CONFIRM_PASSWORD_INPUT,
      password
    );

    await this.page.keyboard.press('Tab');
  }

  /**
   * Click Set New Password button
   */
  async clickSetNewPassword(): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.SET_NEW_PASSWORD_BUTTON
    );
  }

  /**
   * Complete change password flow
   */
  async changePassword(
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    await this.enterNewPassword(newPassword);
    await this.enterConfirmPassword(confirmPassword);
    await this.clickSetNewPassword();
  }
}
