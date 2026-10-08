// step_definitions/addUser.steps.ts

import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { AddUserPage } from '../pages/addUserPage';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { ConfigReader } from '../utils/configReader';

function parseGroups(groups: string): string[] {
  return groups
    .split(',')
    .map(group => group.trim())
    .filter(Boolean);
}

/**
 * Verify Add User page
 */
Then('I should see the Add User page', async function (this: CustomWorld) {

  const addUserPage = new AddUserPage(
    this.page,
    this.runtimeData
  );

  await addUserPage.verifyAddUserPageVisible();
});

/**
 * Fill Full Name
 */
When('I fill the full name in Add User form', async function (this: CustomWorld) {

  const addUserPage = new AddUserPage(
    this.page,
    this.runtimeData
  );

  const user = this.getData('createdUser')
    || TestDataGenerator.user();

  this.setData('createdUser', user);

  await addUserPage.fillFullName(user.fullName);
});

/**
 * Enter email based on type
 */
When(
  'I enter {string} user email',
  async function (
    this: CustomWorld,
    type: string
  ): Promise<void> {

    let email: string | undefined;

    switch (type.toLowerCase()) {

      case 'valid':
        const user = this.getData('createdUser')
          || TestDataGenerator.user();

        email = user.email;

        this.setData('createdUser', {
          ...user,
          email
        });
        break;

      case 'invalid':
        email = 'invalid-email';
        break;

      case 'blank':
        email = '';
        break;

      case 'admin':
        const credentials = ConfigReader.getCredentialsForRole('admin');
        email = credentials.username;
        break;

      case 'created':
        email = this.getData(
          'createdUser'
        )?.email;
        break;

      default:
        email = type;
        break;
    }

    const addUserPage = new AddUserPage(
      this.page,
      this.runtimeData
    );

    await addUserPage.fillEmail(email);

    this.setData('enteredEmail', email);
  }
);
/**
 * Fill Password
 */
When('I fill the password in Add User form', async function (this: CustomWorld) {

  const addUserPage = new AddUserPage(
    this.page,
    this.runtimeData
  );

  const user = this.getData('createdUser')
    || TestDataGenerator.user();

  this.setData('createdUser', user);

  await addUserPage.fillPassword(user.password);
});

/**
 * Select groups
 */
When('I select {string} groups for the user', async function (
  this: CustomWorld,
  groups: string
) {

  const addUserPage = new AddUserPage(
    this.page,
    this.runtimeData
  );

  const selectedGroups = parseGroups(groups);
  const user = this.getData('createdUser')
    || TestDataGenerator.user({ groups: selectedGroups });

  this.setData('createdUser', {
    ...user,
    groups: selectedGroups
  });

  await addUserPage.selectGroups(selectedGroups);
});

/**
 * Select the group created earlier in the scenario
 */
When('I select the created group for the user', async function (this: CustomWorld) {

  const createdGroup = this.getData('createdGroup');

  if (!createdGroup?.name) {
    throw new Error('No createdGroup found in runtime data');
  }

  const addUserPage = new AddUserPage(
    this.page,
    this.runtimeData
  );

  const user = this.getData('createdUser')
    || TestDataGenerator.user({ groups: [createdGroup.name] });

  this.setData('createdUser', {
    ...user,
    groups: [createdGroup.name]
  });

  await addUserPage.selectGroups([createdGroup.name]);
});

/**
 * Click Save User
 */
When('I click Save User button', async function (this: CustomWorld) {

  const addUserPage = new AddUserPage(
    this.page,
    this.runtimeData
  );

  await addUserPage.clickSaveUser();
});

/**
 * Snapshot the current createdUser under a distinct key, so a second user
 * can be created afterwards without overwriting the first one's data.
 * Clears the shared 'createdUser' slot too — otherwise the next "I fill the
 * full name in Add User form" step's `getData('createdUser') || generate()`
 * fallback would silently reuse this same user (and its already-registered
 * email) instead of generating a fresh one.
 */
When('I remember the created user as {string}', async function (this: CustomWorld, key: string) {
  const user = this.getData('createdUser');
  if (!user?.email) {
    throw new Error('No createdUser found in runtime data to remember');
  }

  this.setData(key, user);
  this.setData('createdUser', undefined);
});

/**
 * Create complete user
 */
When('I create a new user', async function (this: CustomWorld) {

  const addUserPage = new AddUserPage(
    this.page,
    this.runtimeData
  );

  const user = await addUserPage.createUser();

  this.setData('createdUser', user);
});

/**
 * Verify validation messages
 */
Then(
  'I should see the add user validation messages',
  async function (this: CustomWorld, dataTable) {

    const addUserPage = new AddUserPage(
      this.page,
      this.runtimeData
    );

    const messages = dataTable.raw().flat();

    await addUserPage.verifyValidationMessages(
      messages
    );
  }
);
