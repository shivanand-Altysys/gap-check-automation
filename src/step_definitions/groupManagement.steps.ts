import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { GroupManagementPage } from '../pages/groupManagementPage';
import { TestDataGenerator } from '../utils/testDataGenerator';

Then('I should see the Group Management page', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyGroupManagementPageVisible();
});

When('I click on Add Group button', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.clickAddGroup();
});

Then('I should see the Add Group page', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyAddGroupPageVisible();
});

When('I enter group name {string}', async function (this: CustomWorld, name: string) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.fillGroupName(name);
});

When('I create a group with the created role', async function (this: CustomWorld) {
  const role = this.getData('createdRole');
  if (!role?.name) {
    throw new Error('No createdRole found in runtime data');
  }

  const group = TestDataGenerator.group({ roleName: role.name });
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);

  await groupManagementPage.createGroup(group);
  this.setData('createdGroup', group);
});

When('I search for the created group by name', async function (this: CustomWorld) {
  const group = this.getData('createdGroup');
  if (!group?.name) {
    throw new Error('No createdGroup found in runtime data');
  }

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.searchGroupByName(group.name);
});

Then('I should see the created group in the list', async function (this: CustomWorld) {
  const group = this.getData('createdGroup');
  if (!group?.name) {
    throw new Error('No createdGroup found in runtime data');
  }

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyGroupExists(group.name);
});

When('I delete the created group', async function (this: CustomWorld) {
  const group = this.getData('createdGroup');
  if (!group?.name) {
    throw new Error('No createdGroup found in runtime data');
  }

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.deleteGroup(group.name);
});

When('I click edit for {string} group', async function (this: CustomWorld, type: string) {
  let groupName: string | undefined;

  switch (type.toLowerCase()) {
    case 'created':
      groupName = this.getData('createdGroup')?.name;
      break;

    case 'updated':
      groupName = this.getData('updatedGroupName');
      break;

    default:
      groupName = type;
      break;
  }

  if (!groupName) {
    throw new Error(`Group name missing for type "${type}"`);
  }

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.clickEditForGroup(groupName);
});

Then('I should see the Edit Group page', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyEditGroupPageVisible();
});

When('I change the group name to a new value', async function (this: CustomWorld) {
  const group = this.getData('createdGroup');
  if (!group?.name) {
    throw new Error('No createdGroup found in runtime data');
  }

  const updatedName = `${group.name} Updated`;
  this.setData('updatedGroupName', updatedName);

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.updateGroupName(updatedName);
});

When('I add a new combination with role {string}, domain {string}, country {string}', async function (
  this: CustomWorld,
  role: string,
  domain: string,
  country: string
) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.addCombination(role, domain, country);
});

When('I add a new combination with the created role, domain {string}, country {string}', async function (
  this: CustomWorld,
  domain: string,
  country: string
) {
  const role = this.getData('createdRole')?.name;
  if (!role) {
    throw new Error('No createdRole found in runtime data');
  }
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.addCombination(role, domain, country);
});

When('I remove the current combination', async function (this: CustomWorld) {
  const group = this.getData('createdGroup');
  if (!group?.roleName || !group?.domain || !group?.country) {
    throw new Error('Created group combination values are missing');
  }

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.removeCombination(group.roleName, group.domain, group.country);
});

When('I click Save Changes button', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.saveGroupChanges();
});

Then('I should see the updated group name in the edit form', async function (this: CustomWorld) {
  const expectedName = this.getData('updatedGroupName');
  if (!expectedName) {
    throw new Error('No updatedGroupName found in runtime data');
  }

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  const actualValue = await groupManagementPage.getGroupNameFieldValue();

  if (actualValue?.trim() !== expectedName) {
    throw new Error(`Expected edit form group name to be "${expectedName}" but found "${actualValue}"`);
  }
});

Then('I should not see the removed combination', async function (this: CustomWorld) {
  const group = this.getData('createdGroup');
  if (!group?.roleName || !group?.domain || !group?.country) {
    throw new Error('Created group combination values are missing');
  }

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyCombinationAbsent(group.roleName, group.domain, group.country);
});

/**
 * NEW STEP IMPLEMENTATIONS - Added to fix undefined steps
 * These steps handle searching and verifying the updated group by name
 */

When('I search for the updated group by name', async function (this: CustomWorld) {
  const updatedGroupName = this.getData('updatedGroupName');
  if (!updatedGroupName) {
    throw new Error('No updatedGroupName found in runtime data');
  }

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.searchGroupByName(updatedGroupName);
});

Then('I should see the updated group in the list', async function (this: CustomWorld) {
  const updatedGroupName = this.getData('updatedGroupName');
  if (!updatedGroupName) {
    throw new Error('No updatedGroupName found in runtime data');
  }

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyGroupExists(updatedGroupName);
});

When('I delete the updated group', async function (this: CustomWorld) {
  const updatedGroupName = this.getData('updatedGroupName');
  if (!updatedGroupName) {
    throw new Error('No updatedGroupName found in runtime data');
  }

  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.deleteGroup(updatedGroupName);
});

When('I select role {string}', async function (this: CustomWorld, role: string) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.selectRole(role);
});

When('I select domain {string}', async function (this: CustomWorld, domain: string) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.selectDomain(domain);
});

When('I select country {string}', async function (this: CustomWorld, country: string) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.selectCountry(country);
});

When('I click Add Row button', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.clickAddRow();
});

When('I click Save Group button', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.clickSaveGroup();
});

Then('I should see the group validation messages', async function (this: CustomWorld, dataTable) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  const messages = dataTable.raw().flat();
  await groupManagementPage.verifyValidationMessages(messages);
});

Then('the Group Name field should be highlighted', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyGroupNameFieldHighlighted();
});

Then('I should not see any combinations added', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyNoCombinationsAdded();
});

Then(
  'I should see only one combination for role {string}, domain {string}, country {string}',
  async function (this: CustomWorld, role: string, domain: string, country: string) {
    const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
    await groupManagementPage.verifyCombinationCount(role, domain, country, 1);
  },
);

When('I click Cancel button', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.clickCancelButton();
});

Then('I should not see {string} group in the list', async function (this: CustomWorld, groupName: string) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyGroupAbsent(groupName);
});

When('I search for {string} group by name', async function (this: CustomWorld, groupName: string) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.searchGroupByName(groupName);
});

Then('I should see {string} group in the list', async function (this: CustomWorld, groupName: string) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyGroupExists(groupName);
});

When('I delete {string} group', async function (this: CustomWorld, groupName: string) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.deleteGroup(groupName);
});

Then(
  'the assignment count for {string} group should be {int}',
  async function (this: CustomWorld, groupName: string, expectedCount: number) {
    const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
    await groupManagementPage.verifyAssignmentCount(groupName, expectedCount);
  },
);

When(
  'I remove combination with role {string}, domain {string}, country {string}',
  async function (this: CustomWorld, role: string, domain: string, country: string) {
    const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
    await groupManagementPage.removeCombination(role, domain, country);
  },
);

Then('I should see an alert dialog titled {string}', async function (this: CustomWorld, title: string) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyAlertDialogTitle(title);
});

Then('the alert dialog message should contain {string}', async function (this: CustomWorld, text: string) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.verifyAlertDialogMessageContains(text);
});

Then(
  'the alert dialog should list the users {string} and {string}',
  async function (this: CustomWorld, userKey1: string, userKey2: string) {
    const user1 = this.getData(userKey1);
    const user2 = this.getData(userKey2);
    if (!user1?.email || !user2?.email) {
      throw new Error(`Missing remembered user data for "${userKey1}" or "${userKey2}"`);
    }

    const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
    await groupManagementPage.verifyAlertDialogListsUser(user1.email);
    await groupManagementPage.verifyAlertDialogListsUser(user2.email);
  },
);

When('I dismiss the alert dialog', async function (this: CustomWorld) {
  const groupManagementPage = new GroupManagementPage(this.page, this.runtimeData);
  await groupManagementPage.dismissAlertDialog();
});
