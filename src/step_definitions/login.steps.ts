import { Given, When, Then } from '@cucumber/cucumber';
import { ConfigReader } from '../utils/configReader';
import { LoginPage } from '../pages/loginPage';
import { CustomWorld } from '../support/world';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { getLogger } from '../core/logger';

const logger = getLogger('login-steps');

/**
 * Given: I navigate to login page
 */
Given('I navigate to login page', async function (this: CustomWorld): Promise<void> {
  this.loginConfig = ConfigReader.getLoginConfig();

  const timeout = Number(process.env.STEP_TIMEOUT || '120000');
  this.page!.setDefaultTimeout(timeout);
  this.page!.setDefaultNavigationTimeout(timeout);

  this.loginPage = new LoginPage(this.page!, this.runtimeData);
  await this.loginPage.navigateToLoginPage(this.loginConfig.base_url);
});

/**
 * When: I login as "{role}" role
 */
When('I login as {string} role', async function (this: CustomWorld, role: string): Promise<void> {
  const { username, password } = ConfigReader.getCredentialsForRole(role);

  if (!username || !password) {
    throw new Error(`Credentials missing for role: ${role}`);
  }

  await this.loginPage!.login(username, password);
});

/**
 * When: I enter "{usernameType}" username for "{role}"
 */
When(
  'I enter {string} username for {string}',
  async function (this: CustomWorld, type: string, role: string): Promise<void> {
    let username: string | undefined;


    switch (type.toLowerCase()) {
      case 'valid':
        const credentials = ConfigReader.getCredentialsForRole(role);
        username = credentials.username;
        break;

      case 'invalid':
        username = 'invalid@test.com';
        break;

      case 'created':
        username = this.getData('createdUser')?.email;
        break;

      default:
        username = type;
        break;
    }

    if (!username) {
      throw new Error(`Username missing for type "${type}" and role "${role}"`);
    }

    this.setData('enteredEmail', username);
    await this.loginPage!.enterUsername(username);
  }
);

/**
 * When: I enter "{passwordType}" password for "{role}"
 */
When(
  'I enter {string} password for {string}',
  async function (this: CustomWorld, type: string, role: string): Promise<void> {
    let password: string | undefined;

    switch (type.toLowerCase()) {
      case 'valid':
        const credentials = ConfigReader.getCredentialsForRole(role);
        password = credentials.password;
        break;

      case 'invalid':
        password = 'Invalid@123';
        break;

      case 'created':
        password = this.getData('createdUser')?.password;
        break;

      case 'new':
        password = this.getData('newPassword');
        break;  

      default:
        password = type;
        break;
    }

    if (!password) {
      throw new Error(`Password missing for type "${type}" and role "${role}"`);
    }

    await this.loginPage!.enterPassword(password);
  }
);

/**
 * When: I click on login button
 */
When('I click on login button', async function (this: CustomWorld): Promise<void> {
  await this.loginPage!.clickLoginButton();
});

/**
 * When: I check remember me checkbox
 */
 When('I check remember me checkbox', async function (this: CustomWorld): Promise<void> {
  await this.loginPage!.checkRememberMe();
});

/**
 * Then: I should be logged in successfully
 */Then('I should be logged in successfully', async function (this: CustomWorld): Promise<void> {
  await this.loginPage!.verifySuccessfulLogin();
});

/**
 * Then: I should see error message "{expectedMessage}"
 */
Then(
  'I should see error message {string}',
  async function (this: CustomWorld, expectedMessage: string): Promise<void> {
    await this.loginPage!.verifyErrorMessage(expectedMessage);
  }
);

/**
 * When: I click on forgot password link
 */
When('I click on forgot password link', async function (this: CustomWorld): Promise<void> {
  await this.loginPage!.clickForgotPassword();
});

/**
 * When: I click on create account link
 */
When('I click on create account link', async function (this: CustomWorld): Promise<void> {
  await this.loginPage!.clickCreateAccount();
});

/**
 * When: I enter generated email for create account
 */
When('I enter generated email for create account', async function (this: CustomWorld): Promise<void> {
  const email = TestDataGenerator.user().email;
  this.setData('createdAccountEmail', email);
  await this.loginPage!.enterCreateAccountEmail(email);
});

/**
 * When: I enter {string} password for create account
 */
When('I enter {string} password for create account', async function (this: CustomWorld, password: string): Promise<void> {
  await this.loginPage!.enterCreateAccountPassword(password);
});

/**
 * When: I enter {string} confirm password for create account
 */
When('I enter {string} confirm password for create account', async function (this: CustomWorld, password: string): Promise<void> {
  await this.loginPage!.enterConfirmCreateAccountPassword(password);
});

/**
 * When: I accept terms and conditions
 */
When('I accept terms and conditions', async function (this: CustomWorld): Promise<void> {
  await this.loginPage!.acceptTermsAndConditions();
});

/**
 * When: I click on create now button
 */
When('I click on create now button', async function (this: CustomWorld): Promise<void> {
  await this.loginPage!.clickCreateNow();
});

/**
 * Then: I should be on forgot password page
 */
Then('I should be on forgot password page', async function (this: CustomWorld): Promise<void> {
  await this.loginPage!.verifyForgotPasswordPage();
});

/**
 * Then: I should be on create account page
 */
Then('I should be on create account page', async function (this: CustomWorld): Promise<void> {
  await this.loginPage!.verifyCreateAccountPage();
});

/**
 * Then: I should see verification email sent message
 */
Then('I should see verification email sent message', async function (this: CustomWorld): Promise<void> {
  const email = this.getData('createdAccountEmail');
  if (!email) {
    throw new Error('No generated account email found in runtime data.');
  }
  await this.loginPage!.verifyVerificationEmailSent(email);
});

/**
 * When: I click on submit button
 */
When('I click on submit button', async function (this: CustomWorld): Promise<void> {
  await this.loginPage!.clickSubmitButton();
});

/**
 * Then: I should see reset email sent message
 */
Then(
  'I should see reset email sent message',
  async function (this: CustomWorld): Promise<void> {
    const email = this.getData('enteredEmail');
    if (!email) throw new Error('No email found in runtime data!');
    await this.loginPage!.verifyResetEmailSent(email);
  }
);

/**
 * Then: I should be on change password page
 */
Then(
  'I should be on change password page',
  async function (this: CustomWorld): Promise<void> {
    await this.loginPage!.verifyChangePasswordPage();
  }
);


When(
  'I enter new password {string}',
  async function (this: CustomWorld, password: string): Promise<void> {
    await this.loginPage!.enterNewPassword(password);
  }
);


When(
  'I enter confirm password {string}',
  async function (this: CustomWorld, password: string): Promise<void> {
    await this.loginPage!.enterConfirmPassword(password);
  }
);

/**
 * When: I click on set new password button
 */
When(
  'I click on set new password button',
  async function (this: CustomWorld): Promise<void> {
    await this.loginPage!.clickSetNewPassword();
  }
);

/**
 * When: I change password to "{password}"
 * Use specific password
 */
When(
  'I change password to {string}',
  async function (this: CustomWorld, password: string): Promise<void> {
    this.setData('newPassword', password);
    await this.loginPage!.changePassword(password, password);
  }
);

/**
 * Generates password using TestDataGenerator
 */
When(
  'I change my password',
  async function (this: CustomWorld): Promise<void> {
    const newPassword = TestDataGenerator.generateValidPassword();
    this.setData('newPassword', newPassword);
    logger.info(`Using generated password: ${newPassword}`);
    await this.loginPage!.changePassword(newPassword, newPassword);
  }
);
