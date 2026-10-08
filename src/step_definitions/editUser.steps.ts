import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { EditUserPage } from '../pages/editUserPage';

function parseGroups(groups: string): string[] {
  return groups
    .split(',')
    .map(group => group.trim())
    .filter(Boolean);
}

/**
 * Verify Edit User page
 */
Then('I should see the Edit User page', async function (this: CustomWorld) {
  const editUserPage = new EditUserPage(this.page!, this.runtimeData);
  await editUserPage.verifyEditUserPageVisible();
});


/**
 * Update user full name and store in runtimeData
 */
When('I update the user', async function (this: CustomWorld) {
  const editUserPage = new EditUserPage(this.page!, this.runtimeData);

  const updatedName = await editUserPage.updateUser();

  // Override createdUser with updated name
  const createdUser = this.getData('createdUser');
  this.setData('createdUser', {
    ...createdUser,
    fullName: updatedName
  });
});

/**
 * Select groups on Edit User page
 */
When('I select {string} groups in Edit User form', async function (
  this: CustomWorld,
  groups: string
) {
  const editUserPage = new EditUserPage(this.page!, this.runtimeData);
  const selectedGroups = parseGroups(groups);

  await editUserPage.selectGroups(selectedGroups);

  const createdUser = this.getData('createdUser');
  this.setData('createdUser', {
    ...createdUser,
    groups: selectedGroups
  });
});
