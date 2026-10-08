import { Given, When, Then } from '@cucumber/cucumber';
import { Sidebar } from '../pages/sideBar';

// Initialize sidebar page in world
Given('the sidebar is loaded', async function () {
  this.sidebar = new Sidebar(this.page, this.runtimeData);
  await this.sidebar.verifySidebarLoaded();
});

// Navigation steps
When('I click on Dashboard in sidebar', async function () {
  await this.sidebar.clickDashboard();
});

When('I click on User Role & Administration in sidebar', async function () {
  await this.sidebar.clickUserRoleAndAdministration();
});

When('I click on Audit Log in sidebar', async function () {
  await this.sidebar.clickAuditLog();
});

When('I click on Country Management in sidebar', async function () {
  await this.sidebar.clickCountryManagement();
});

When('I click on Survey Engine in sidebar', async function () {
  await this.sidebar.clickSurveyEngine();
});

When('I click on User Management in sidebar', async function () {
  await this.sidebar.clickUserManagement();
});

When('I click on Role Management in sidebar', async function () {
  await this.sidebar.clickRoleManagement();
});

When('I click on Group Management in sidebar', async function () {
  await this.sidebar.clickGroupManagement();
});

// Verification steps
Then('I should see {string} in sidebar', async function (navItem: string) {
  await this.sidebar.verifyNavItemVisible(navItem);
});

Then('Dashboard should be active in sidebar', async function () {
  await this.sidebar.verifyDashboardIsActive();
});
