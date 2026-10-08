import path from 'path';
import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { DocumentManagementPage } from '../pages/documentManagementPage';
import { Sidebar } from '../pages/sideBar';

When('I click on Document Management in sidebar', async function (this: CustomWorld) {
  const sidebar = new Sidebar(this.page!, this.runtimeData);
  await sidebar.clickDocumentManagement();
});

Then('I should see the Document Management page', async function (this: CustomWorld) {
  const page = new DocumentManagementPage(this.page!, this.runtimeData);
  await page.verifyDocumentManagementPageVisible();
});

When('I click on Upload Document button', async function (this: CustomWorld) {
  const page = new DocumentManagementPage(this.page!, this.runtimeData);
  await page.clickUploadDocumentButton();
});

Then('I should see the Upload Document page', async function (this: CustomWorld) {
  const page = new DocumentManagementPage(this.page!, this.runtimeData);
  await page.verifyUploadDocumentPageVisible();
});

When('I upload a valid document', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  const title = `Automation Document ${Date.now()}`;
  const language = 'cs_CZ';

  const filePath = path.resolve(
    __dirname,
    '..',
    '..',
    'fixtures',
    'sample.pdf'
  );

  this.setData('uploadedDocumentTitle', title);
  this.setData('uploadedDocumentFilePath', filePath);

  // Monitor for success toast before navigation
  const toastPromise = this.page!.waitForSelector(
    '.wi-toast-body',
    { timeout: 5000 }
  ).then(() => true).catch(() => false);

  await page.uploadDocument(
    title,
    language,
    filePath
  );

  // Wait briefly for toast (it may appear during redirect)
  await toastPromise;
});


When(
  'I wait until extraction completes',
  { timeout: 960000 },
  async function (this: CustomWorld) {
    const page = new DocumentManagementPage(this.page!, this.runtimeData);

    await page.waitForExtractionComplete(
      this.getData('uploadedDocumentTitle')
    );
  }
);

When('I search uploaded document', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.searchForDocument(
    this.getData('uploadedDocumentTitle')
  );
});

Then('uploaded document should appear in document listing', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.verifyDocumentExists(
    this.getData('uploadedDocumentTitle')
  );
});

When('I open Review page', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.openReviewPage(
    this.getData('uploadedDocumentTitle')
  );
});

Then('Review Extraction page should open', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.verifyReviewPageVisible();
});

Then('original PDF should be visible', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.verifyPdfViewerVisible();
});

Then('extracted HTML should be visible', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.verifyHtmlEditorVisible();
});

When('I switch Content Editor to code view', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.openContentEditorCodeView();
});

Then('extracted HTML should not contain inline CSS', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.verifyExtractedHtmlHasNoInlineCss();
});

Then('extraction issues panel should be visible', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.verifyExtractionIssuesVisible();
});

Then(
  'extraction accuracy compared to source PDF should be at least {int}%',
  { timeout: 60000 },
  async function (this: CustomWorld, thresholdPercent: number) {

    const page = new DocumentManagementPage(this.page!, this.runtimeData);

    await page.verifyExtractionAccuracyAtLeast(
      this.getData('uploadedDocumentFilePath'),
      thresholdPercent
    );
  }
);

When('I edit extracted HTML', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.editExtractedHtml(
    '<p>Automation Update</p>'
  );
});

When('I publish document', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.publishDocument();
});


When('I delete uploaded document', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.deleteDocument(
    this.getData('uploadedDocumentTitle')
  );
});

Then('uploaded document should be deleted', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.verifyDocumentDeleted(
    this.getData('uploadedDocumentTitle')
  );

  
});

When('I click on Delete icon for uploaded document', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.clickDeleteIcon(
    this.getData('uploadedDocumentTitle')
  );
});

Then('delete confirmation popup should display', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.verifyDeleteConfirmationVisible();
});

When('I confirm document deletion', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.confirmDeletion();
});


When('I click on an extraction issue', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  // selectFirstExtractionIssue() waits for the first .issue-item to render,
  // so the count must be read afterward — the issues panel loads
  // asynchronously and reads as 0 if checked too early. Selecting a row
  // doesn't change the total, so this still reflects the pre-resolve count.
  await page.selectFirstExtractionIssue();

  const countBefore = await page.getExtractionIssueCount();
  this.setData('issueCountBeforeResolve', countBefore);
});

When('I click on Resolve button for the issue', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.clickResolveButtonForSelectedIssue();
});

Then('resolve confirmation popup should display', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.verifyResolveConfirmationVisible();
});

When('I confirm issue resolution', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.confirmResolveIssue();
});

Then('I should see issue resolved success message', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  await page.verifyIssueResolvedSuccessMessage();
});

Then('extraction issue count should be reduced', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);

  const countBefore: number = this.getData('issueCountBeforeResolve');
  const countAfter = await page.getExtractionIssueCount();

  if (countAfter !== countBefore - 1) {
    throw new Error(
      `Expected extraction issue count to drop from ${countBefore} to ${countBefore - 1}, but found ${countAfter}`
    );
  }
});

When('I resolve all extraction issues', async function (this: CustomWorld) {

    const page = new DocumentManagementPage(
        this.page!,
        this.runtimeData
    );

    await page.resolveAllExtractionIssues();
});


When(
  'I fill upload form with title {string} language {string} and file {string}',
  async function (this: CustomWorld, title: string, language: string, uploadFile: string) {

    const page = new DocumentManagementPage(this.page!, this.runtimeData);
    await page.fillUploadFormPartial(title, language, uploadFile.trim().toLowerCase() === 'yes');
  }
);

When('I click Save without a valid file', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);
  await page.clickSaveWithoutFile();
});

Then(
  'I should see validation messages {string}',
  async function (this: CustomWorld, expectedMessages: string) {

    const page = new DocumentManagementPage(this.page!, this.runtimeData);
    const messages = expectedMessages.split(',').map((m) => m.trim());

    await page.verifyValidationMessagesVisible(messages);
  }
);

Then('I should remain on the Upload Document page', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);
  await page.verifyRemainsOnUploadPage();
});

Then('document should not be uploaded', async function (this: CustomWorld) {

  const page = new DocumentManagementPage(this.page!, this.runtimeData);
  await page.verifyDocumentNotUploaded();
});
Then('mandatory fields should be highlighted', async function (this: CustomWorld) {
  const page = new DocumentManagementPage(this.page!, this.runtimeData);
  await page.verifyMandatoryFieldsHighlighted();
});