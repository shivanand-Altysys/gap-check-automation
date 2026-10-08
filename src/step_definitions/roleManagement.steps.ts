import { Given, Then, When, DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { RoleManagementPage } from '../pages/roleManagementPage';
import { Sidebar } from '../pages/sideBar';
import { TestDataGenerator } from '../utils/testDataGenerator';

Given('User navigates to Role Management page', async function (this: CustomWorld) {
    const sidebar = new Sidebar(this.page, this.runtimeData);
    await sidebar.verifySidebarLoaded();
    await sidebar.clickRoleManagement();
    this.setData('sidebar', sidebar);
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.verifyRoleManagementPageVisible();
});

Then('I should see the Role Management page', async function (this: CustomWorld) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.verifyRoleManagementPageVisible();
});

When('I create a new role for role group assignment', async function (this: CustomWorld) {
    const role = TestDataGenerator.role();
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);

    await roleManagementPage.createRole(role);
    this.setData('createdRole', role);
    this.setData('createdRoleName', role.name);
    this.trackCreatedRole(role.name);
});

When('I delete the created role', async function (this: CustomWorld) {
    const role = this.getData('createdRole');
    if (!role?.name) {
        throw new Error('No createdRole found in runtime data');
    }

    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.deleteRole(role.name);
});

When("User clicks on Add Role button", async function () {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.clickAddRole();
});

When("User enters role details", async function (this: CustomWorld, dataTable: DataTable) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    const data = dataTable.hashes()[0];

    if (data.roleName === '(created)') {
        // Reuse the role already created earlier in this scenario (via the runtime
        // object), instead of generating a new unique name — used for flows like
        // duplicate-name validation that need to re-enter an already-existing name.
        const existingRoleName = this.getData('createdRoleName');
        if (!existingRoleName) {
            throw new Error('User enters role details: "(created)" was used but no createdRoleName exists in runtime data yet');
        }

        await roleManagementPage.enterRoleName(existingRoleName);
        await roleManagementPage.enterDescription(data.description);
        // Deliberately do NOT overwrite createdRoleName or track a new role here —
        // this is a re-entry of the existing one, not a new creation.
    } else {
        // Ensure uniqueness so repeated runs don't collide with a leftover role
        const uniqueRoleName = `${data.roleName} ${Date.now()}`;

        await roleManagementPage.enterRoleName(uniqueRoleName);
        await roleManagementPage.enterDescription(data.description);

        this.setData('createdRoleName', uniqueRoleName);
        this.trackCreatedRole(uniqueRoleName);
        this.setData('roleEntity', data.entity);
    }
});

When("User clicks on Save button", async function () {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.clickSave();
});

Then("Newly created role should appear in role list and be selected", async function (this: CustomWorld) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    const roleName = this.getData('createdRoleName');
    await roleManagementPage.verifyRoleCreatedAndSelected(roleName);
});

Then("I should see the created role in role list", async function (this: CustomWorld) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    const roleName = this.getData('createdRoleName');
    await roleManagementPage.verifyRoleExists(roleName);
});

Then("All permissions should be unchecked by default", async function () {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.verifyPermissionsUnchecked();
});

When("User leaves role name blank and enters description", async function (dataTable: DataTable) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    const data = dataTable.hashes()[0];
    await roleManagementPage.enterDescription(data.description);
});

Then("Validation message should display for role name", async function () {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.verifyRoleNameValidationVisible();
});

Then("Role should not be created", async function () {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.verifyCreateRoleModalOpen();
});

Then("User should remain on Add Role popup", async function () {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.verifyCreateRoleModalOpen();
});

// ── Duplicate role name validation (ROLE_MGMT_005) ──

Then('Only one role tab named {string} should exist', async function (this: CustomWorld, _placeholder: string) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    const roleName = this.getData('createdRoleName');
    await roleManagementPage.verifyRoleTabCount(roleName, 1);
});

// ── Edit Role / permissions matrix (ROLE_MGMT_007) ──

When('User selects role {string}', async function (this: CustomWorld, roleName: string) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.selectRole(roleName);
});

When('User selects the created role', async function (this: CustomWorld) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    const roleName = this.getData('createdRoleName');
    if (!roleName) {
        throw new Error('No createdRoleName found in runtime data');
    }
    await roleManagementPage.selectRole(roleName);
});

Then('Permission {string} should be unchecked for entity {string}', async function (
    this: CustomWorld, permission: string, entity: string
) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.verifyPermissionUnchecked(entity, permission);
});

Then('Permission {string} should be checked for entity {string}', async function (
    this: CustomWorld, permission: string, entity: string
) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.verifyPermissionChecked(entity, permission);
});

When('User checks the following permissions for entity {string}', async function (
    this: CustomWorld, entity: string, dataTable: DataTable
) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    const rows = dataTable.hashes();
    for (const row of rows) {
        await roleManagementPage.untogglePermission(entity, row.permission); // force to unchecked first
        await roleManagementPage.togglePermission(entity, row.permission);   // then check it — guarantees a real state change
        await roleManagementPage.verifyPermissionChecked(entity, row.permission);
    }
});

When('User clicks on Save button for permissions', async function (this: CustomWorld) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    await roleManagementPage.clickSavePermissions();
});

Then('I capture the permissions save toast text for debugging', async function (this: CustomWorld) {
    const toast = this.page.locator('.wi-toast-body').first();
    await toast.waitFor({ state: 'visible', timeout: 20000 });
    const text = await toast.textContent();
    console.log('ACTUAL TOAST TEXT:', text);
});

When('User refreshes the page', async function (this: CustomWorld) {
    await this.page.reload();
});

Then('Permissions for entity {string} should include', async function (
    this: CustomWorld, entity: string, dataTable: DataTable
) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    const rows = dataTable.hashes();
    const failures: string[] = [];

    for (const row of rows) {
        try {
            await roleManagementPage.verifyPermissionChecked(entity, row.permission);
        } catch (e) {
            failures.push(row.permission);
        }
    }

    if (failures.length > 0) {
        throw new Error(`These permissions did NOT persist after refresh: ${failures.join(', ')}`);
    }
});

// Verify permission checkbox selection and deselection functionality
When('User unchecks the following permissions for entity {string}', async function (
    this: CustomWorld, entity: string, dataTable: DataTable
) {
    const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
    const rows = dataTable.hashes();
    for (const row of rows) {
        await roleManagementPage.untogglePermission(entity, row.permission);
        await roleManagementPage.verifyPermissionUnchecked(entity, row.permission);
    }
}); 
