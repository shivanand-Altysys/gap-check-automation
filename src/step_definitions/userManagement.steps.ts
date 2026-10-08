// step_definitions/userManagement.steps.ts

import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { UserManagement } from '../pages/userManagementPage';
import { AddUserPage } from '../pages/addUserPage';
import { ConfigReader } from '../utils/configReader';

Then('I should see the User Management page', async function (this: CustomWorld) {
  const userManagement = new UserManagement(this.page!, this.runtimeData);
  await userManagement.verifyUserManagementPageVisible();
});

When('I click on Add User button', async function (this: CustomWorld) {
  const userManagement = new UserManagement(this.page!, this.runtimeData);
  await userManagement.clickAddUser();
});

/**
 * Click Cancel button on Add User form
 */
When('I click Cancel button', async function (this: CustomWorld) {
  const addUser = new AddUserPage(this.page!, this.runtimeData);
  await addUser.clickCancel();
});

/**
 * When: I search for "{type}" user by email for "{role}"
 * type: "created" → uses runtime createdUser email
 * type: "valid"   → uses role email from config
 * type: any email → uses exact value passed
 */
When(
  'I search for {string} user by email',
  async function (this: CustomWorld, type: string): Promise<void> {
    let email: string | undefined;

    switch (type.toLowerCase()) {
      case 'admin':
        const credentials = ConfigReader.getCredentialsForRole(type);
        email = credentials.username;
        break;

      case 'created':
        email = this.getData('createdUser')?.email;
        break;

      default:
        email = type;
        break;
    }

    if (!email) {
      throw new Error(`Email missing for type "${type}"`);
    }

    const userManagement = new UserManagement(this.page!, this.runtimeData);
    await userManagement.searchByEmail(email);
  }
);

/**
 * Then: I should see "{type}" user in the list for "{role}"
 * type: "created" → uses runtime createdUser email
 * type: "valid"   → uses role email from config
 * type: any email → uses exact value passed
 */
Then(
  'I should see {string} user in the list',
  async function (this: CustomWorld, type: string): Promise<void> {
    let email: string | undefined;

    switch (type.toLowerCase()) {
      case 'admin':
        const credentials = ConfigReader.getCredentialsForRole(type);
        email = credentials.username;
        break;

      case 'created':
        email = this.getData('createdUser')?.email;
        break;

      default:
        email = type;
        break;
    }

    if (!email) {
      throw new Error(`Email missing for type "${type}"`);
    }

    const userManagement = new UserManagement(this.page!, this.runtimeData);
    await userManagement.verifyUserExists(email);
  }
);

/**
 * Then: I should not see "{type}" user in the list for "{role}"
 * type: "created" → uses runtime createdUser email
 * type: "valid"   → uses role email from config
 * type: any email → uses exact value passed
 */
Then(
  'I should not see {string} user in the list',
  async function (this: CustomWorld, type: string): Promise<void> {
    let email: string | undefined;

    switch (type.toLowerCase()) {
      case 'admin':
        const credentials = ConfigReader.getCredentialsForRole(type);
        email = credentials.username;
        break;

      case 'created':
        email = this.getData('createdUser')?.email;
        break;

      default:
        email = type;
        break;
    }

    if (!email) {
      throw new Error(`Email missing for type "${type}"`);
    }

    const userManagement = new UserManagement(this.page!, this.runtimeData);
    await userManagement.verifyUserNotExists(email);
  }
);

/**
 * When: I delete "{type}" user for "{role}"
 * type: "created" → uses runtime createdUser email
 * type: "valid"   → uses role email from config
 * type: any email → uses exact value passed
 */
When(
  'I delete {string} user',
  async function (this: CustomWorld, type: string): Promise<void> {
    let email: string | undefined;

    switch (type.toLowerCase()) {
      case 'admin':
        const credentials = ConfigReader.getCredentialsForRole(type);
        email = credentials.username;
        break;

      case 'created':
        email = this.getData('createdUser')?.email;
        break;

      default:
        email = type;
        break;
    }

    if (!email) {
      throw new Error(`Email missing for type "${type}"`);
    }

    const userManagement = new UserManagement(this.page!, this.runtimeData);
    await userManagement.deleteUserByEmail(email);
  }
);

/**
 * Delete two previously-remembered users (see "I remember the created user as ...")
 */
When(
  'I delete the users {string} and {string}',
  async function (this: CustomWorld, userKey1: string, userKey2: string): Promise<void> {
    const user1 = this.getData(userKey1);
    const user2 = this.getData(userKey2);
    if (!user1?.email || !user2?.email) {
      throw new Error(`Missing remembered user data for "${userKey1}" or "${userKey2}"`);
    }

    const userManagement = new UserManagement(this.page!, this.runtimeData);
    await userManagement.deleteUserByEmail(user1.email);
    await userManagement.deleteUserByEmail(user2.email);
  },
);

/**
 * Click edit button for created user
 */
When('I click edit for "created" user', async function (this: CustomWorld) {
  const email = this.getData('createdUser')?.email;
  if (!email) throw new Error('No createdUser email found in runtime data');

  const userManagement = new UserManagement(this.page!, this.runtimeData);
  await userManagement.editUserByEmail(email);
});

/**
 * Verify updated name in user table
 */
Then('I should see the updated name in the user list', async function (this: CustomWorld) {
  const createdUser = this.getData('createdUser');
  if (!createdUser?.email || !createdUser?.fullName) {
    throw new Error('Missing createdUser email or fullName in runtime data');
  }

  const userManagement = new UserManagement(this.page!, this.runtimeData);
  await userManagement.verifyNameInTable(
    createdUser.email,
    createdUser.fullName
  );
});

/**
 * Deactivate user
 */
When(
  'I deactivate {string} user',
  async function (this: CustomWorld, type: string): Promise<void> {
    let email: string | undefined;

    switch (type.toLowerCase()) {
      case 'admin':
        const credentials = ConfigReader.getCredentialsForRole(type);
        email = credentials.username;
        break;
      case 'created':
        email = this.getData('createdUser')?.email;
        break;
      default:
        email = type;
        break;
    }

    if (!email) throw new Error(`Email missing for type "${type}"`);

    const userManagement = new UserManagement(this.page!, this.runtimeData);
    await userManagement.deactivateUserByEmail(email);
  }
);

/**
 * Activate user
 */
When(
  'I activate {string} user',
  async function (this: CustomWorld, type: string): Promise<void> {
    let email: string | undefined;

    switch (type.toLowerCase()) {
      case 'admin':
        const credentials = ConfigReader.getCredentialsForRole(type);
        email = credentials.username;
        break;
      case 'created':
        email = this.getData('createdUser')?.email;
        break;
      default:
        email = type;
        break;
    }

    if (!email) throw new Error(`Email missing for type "${type}"`);

    const userManagement = new UserManagement(this.page!, this.runtimeData);
    await userManagement.activateUserByEmail(email);
  }
);

/**
 * Verify user status
 */
Then(
  'I should see {string} user status as {string}',
  async function (
    this: CustomWorld,
    type: string,
    status: string
  ): Promise<void> {
    let email: string | undefined;

    switch (type.toLowerCase()) {
      case 'created':
        email = this.getData('createdUser')?.email;
        break;
      default:
        email = type;
        break;
    }

    if (!email) throw new Error(`Email missing for type "${type}"`);

    const userManagement = new UserManagement(this.page!, this.runtimeData);
    await userManagement.verifyUserStatus(
      email,
      status as 'Active' | 'Inactive'
    );
  }
);

// Verify filtering users by status
When('I click on Status filter dropdown', async function (this: CustomWorld) {
  const userManagement = new UserManagement(this.page!, this.runtimeData);
  await userManagement.clickStatusFilterDropdown();
});
When(
  'I select {string} status filter',
  async function (this: CustomWorld, status: string): Promise<void> {
    const userManagement = new UserManagement(this.page!, this.runtimeData);
    await userManagement.selectStatusFilter(status);
  }
);
Then(
  'all users in the list should have status {string}',
  async function (this: CustomWorld, status: string): Promise<void> {
    const userManagement = new UserManagement(this.page!, this.runtimeData);
    await userManagement.verifyAllUsersHaveStatus(
      status as 'Active' | 'Inactive'
    );
  }
);