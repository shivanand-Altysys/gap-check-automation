import { When, Then } from '@cucumber/cucumber';
import { AuditLogPage } from '../pages/auditLogPage';

// ── Setup ────────────────────────────────────────────────────────
Then('I should see the Audit Log page', async function () {
  this.auditLogPage = new AuditLogPage(
    this.page,
    this.runtimeData
  );

  await this.auditLogPage.verifyAuditLogPageVisible();
});

// ── Audit Entries Verification ───────────────────────────────────
Then(
  'I should see audit log entry with action {string}',
  async function (action: string) {

    await this.auditLogPage
      .verifyAuditLogEntryByAction(action);
  }
);

Then(
  'I should see country audit log entry with action {string}',
  async function (action: string) {

    await this.auditLogPage
      .verifyCountryAuditLogEntry(action);
  }
);

// ── Action Filter ────────────────────────────────────────────────
When(
  'I select {string} filter in audit log',
  async function (filterOption: string) {

    await this.auditLogPage
      .selectActionFilter(filterOption);
  }
);

Then(
  'all displayed records should have action {string}',
  async function (action: string) {

    await this.auditLogPage
      .verifyFilteredResults(action);
  }
);

// ── Details Popup ────────────────────────────────────────────────
When(
  'I view audit log details {string}',
  async function (auditRecord: string) {

    if (auditRecord === 'First audit') {
      await this.auditLogPage.openFirstAuditDetails();
    }

    else if (auditRecord === 'Last audit') {
      const rows =
        await this.auditLogPage.getTableRowCount();

      await this.auditLogPage
        .openAuditDetailsByRow(rows);
    }
  }
);

Then(
  'Audit Entry Details popup should be displayed',
  async function () {

    await this.auditLogPage
      .verifyDetailsModalVisible();
  }
);

// ── AUDIT_004 ────────────────────────────────────────────────────
When(
  'I open UPDATE audit entry details',
  async function () {

    await this.auditLogPage
      .openUpdateAuditDetails();
  }
);

Then(
  'old value should be displayed',
  async function () {

    await this.auditLogPage
      .verifyOldValueExists();
  }
);

Then(
  'new value should be displayed',
  async function () {

    await this.auditLogPage
      .verifyNewValueExists();
  }
);

Then(
  'audit details should show correct old and new country values',
  async function () {

    const createdCountry =
      this.getData('createdCountry');

    const updatedCountry =
      this.getData('updatedCountry');

    await this.auditLogPage
      .verifyCountryUpdateValues(
        createdCountry.title,
        updatedCountry.title
      );
  }
);

// ── Pagination ───────────────────────────────────────────────────
When(
  'I set audit log records per page to {int}',
  async function (pageSize: number) {

    this.pageSize = pageSize;

    await this.auditLogPage
      .setRecordsPerPage(pageSize);
  }
);

Then(
  'records should load correctly',
  async function () {

    const rowCount =
      await this.auditLogPage.getTableRowCount();

    if (rowCount === 0) {
      throw new Error('No records loaded');
    }

    if (rowCount > this.pageSize) {
      throw new Error(
        `Expected maximum ${this.pageSize} records but found ${rowCount}`
      );
    }
  }
);