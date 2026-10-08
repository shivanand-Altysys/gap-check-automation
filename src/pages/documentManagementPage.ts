import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { DocumentManagementLocators } from '../locators/documentmanagementObject';
import { Actions } from '../utils/actions';
import { Assertions } from '../utils/assertions';
import { PdfTextExtractor } from '../utils/pdfTextExtractor';
import { RuntimeData } from '../types';
import { TopBarPage } from './topBarPage';
import path from 'path';
import fs from 'fs';



export class DocumentManagementPage extends BasePage {
  private locators: DocumentManagementLocators;

  private static readonly ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.html', '.jpg', '.jpeg', '.png'];


  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new DocumentManagementLocators();
  }

  // ============================================================
  // Document Management Page
  // ============================================================

  async verifyDocumentManagementPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(this.page, this.runtimeData);
    await topBarPage.verifyPageTitle('Document Management');
  }

  async clickUploadDocumentButton(): Promise<void> {
    await Actions.click(this.page, this.locators.UPLOAD_DOCUMENT_BUTTON);
  }

  async searchForDocument(title: string): Promise<void> {

    const input = Actions.resolve(
      this.page,
      this.locators.TITLE_FILTER_INPUT
    );

    await input.fill('');
    await input.fill(title);

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.documentRow(title)
    );
  }

  async verifyDocumentExists(title: string): Promise<void> {
    await Assertions.verifyElementVisible(
      this.page,
      this.locators.documentRow(title)
    );
  }

  async openReviewPage(title: string): Promise<void> {

    await Actions.click(
      this.page,
      this.locators.reviewButton(title)
    );
  }

  async clickDeleteIcon(title: string): Promise<void> {

    await this.searchForDocument(title);

    await Assertions.verifyElementVisible(
        this.page,
        this.locators.documentRow(title)
    );

    // Delete button only renders once the document reaches a deletable
    // state (e.g. "Extracted") — wait for it explicitly instead of
    // clicking immediately, so this method is safe even if a caller
    // forgets to wait for extraction first.
    const deleteButton = Actions.resolve(
        this.page,
        this.locators.deleteButtonByTitle(title)
    );
    await deleteButton.waitFor({ state: 'visible', timeout: 60000 });

    await Actions.click(
        this.page,
        this.locators.deleteButtonByTitle(title)
    );
  }

  async verifyDeleteConfirmationVisible(): Promise<void> {

    await Assertions.verifyElementVisible(
        this.page,
        this.locators.CONFIRM_DIALOG
    );
  }

  async confirmDeletion(): Promise<void> {

    // Deliberately no networkidle wait here — the success toast
    // auto-dismisses after 4s (useToastStore.js), so callers that need
    // to assert on it (via the common "I should see message" step) must
    // check immediately. verifyDocumentDeleted waits on its own state.
    await Actions.click(
        this.page,
        this.locators.CONFIRM_DELETE_BUTTON
    );
  }

  async deleteDocument(title: string): Promise<void> {

    await this.clickDeleteIcon(title);
    await this.verifyDeleteConfirmationVisible();
    await this.confirmDeletion();
  }

  async verifyDocumentDeleted(title: string): Promise<void> {

    const input = Actions.resolve(
        this.page,
        this.locators.TITLE_FILTER_INPUT
    );

    await input.fill('');
    await input.fill(title);

    await this.page.waitForLoadState('networkidle');

    const visible = await Actions.isVisible(
        this.page,
        this.locators.documentRow(title)
    );

    if (visible) {
        throw new Error(`Document still exists: ${title}`);
    }
}

  // ============================================================
  // Upload Document Page
  // ============================================================

  async verifyUploadDocumentPageVisible(): Promise<void> {

    const topBarPage = new TopBarPage(this.page, this.runtimeData);

    await topBarPage.verifyPageTitle('Upload Document');

    await Assertions.verifyUrlContains(
      this.page,
      'document/upload'
    );
  }

  async enterDocumentTitle(title: string): Promise<void> {

    await Actions.type(
      this.page,
      this.locators.TITLE_INPUT,
      title
    );
  }

  async selectLanguage(language: string): Promise<void> {

    await Actions.click(
      this.page,
      this.locators.LANGUAGE_SELECT_TRIGGER
    );

    await Actions.click(
      this.page,
      this.locators.languageOption(language)
    );
  }

  async uploadDocumentFile(filePath: string): Promise<void> {

    const fileInput = Actions.resolve(
      this.page,
      this.locators.FILE_INPUT
    );

    await fileInput.setInputFiles(filePath);
  }

  async clickSave(): Promise<void> {

    await Actions.click(
      this.page,
      this.locators.SAVE_BUTTON
    );
  }

  async uploadDocument(
    title: string,
    language: string,
    filePath: string
  ): Promise<void> {

    await this.enterDocumentTitle(title);
    await this.selectLanguage(language);
    await this.uploadDocumentFile(filePath);
    await this.clickSave();

    // Wait for redirect to documents listing (proof that upload succeeded)
    await this.page.waitForURL(/\/documents/, { timeout: 30000 });
  }

// ============================================================
  // Upload Document Validation (DM_TC_003)
  // ============================================================

  // ============================================================
// Upload Document Validation (DM_TC_003)
// ============================================================

async fillUploadFormPartial(
  title: string,
  language: string,
  uploadFile: boolean
): Promise<void> {

  if (title.trim() !== '') {
    await this.enterDocumentTitle(title);
  }

  if (language.trim() !== '') {
    await this.selectAnyLanguage();
  }

  if (uploadFile) {
    await this.uploadAnyValidFile();
  }
}

// Point 5 needs "not uploaded" to be genuinely tested — picks whichever
// accepted-type fixture exists, so the test isn't tied to one named file.
async uploadAnyValidFile(): Promise<void> {

  const fixturesDir = path.resolve(__dirname, '..', '..', 'fixtures');

  const candidate = fs
    .readdirSync(fixturesDir)
    .find((name) =>
      DocumentManagementPage.ACCEPTED_EXTENSIONS.includes(path.extname(name).toLowerCase())
    );

  if (!candidate) {
    throw new Error(
      `No fixture file with an accepted extension (${DocumentManagementPage.ACCEPTED_EXTENSIONS.join(', ')}) found in ${fixturesDir}`
    );
  }

  await this.uploadDocumentFile(path.join(fixturesDir, candidate));
}

async selectAnyLanguage(): Promise<void> {

  await Actions.click(this.page, this.locators.LANGUAGE_SELECT_TRIGGER);

  const firstOption = this.page
    .locator('[role="listbox"] button[role="option"]')
    .first();

  await firstOption.waitFor({ state: 'visible' });
  await firstOption.click();
}

async clickSaveWithoutFile(): Promise<void> {

  await this.clickSave();

  await Promise.race([
    this.page.locator(this.locators.FILE_ERROR_MESSAGE.value).waitFor({ state: 'visible' }),
    this.page.locator('.upload-document-card').getByText(/is required/i).first().waitFor({ state: 'visible' }),
  ]).catch(() => {});
}

// Point 1, 2, 3
async verifyValidationMessagesVisible(messages: string[]): Promise<void> {

  for (const message of messages) {
    const trimmed = message.trim();

    const locator = trimmed === 'Upload a document file.'
      ? this.locators.FILE_ERROR_MESSAGE
      : this.locators.validationMessage(trimmed);

    await Assertions.verifyElementVisible(this.page, locator);
  }
}

// Point 4 — reinstated. Best-effort check since InputField.vue/SelectField.vue
// internals aren't confirmed; checks whichever invalid-state markers exist.
async verifyMandatoryFieldsHighlighted(): Promise<void> {

  const invalidLocators = [
    this.locators.TITLE_INPUT_INVALID,
    this.locators.LANGUAGE_SELECT_INVALID,
    this.locators.FILE_ERROR_MESSAGE, // file has no ".is-invalid" class, but its error text is the equivalent signal
  ];

  let anyHighlighted = false;

  for (const locator of invalidLocators) {
    if (await Actions.isVisible(this.page, locator)) {
      anyHighlighted = true;
    }
  }

  if (!anyHighlighted) {
    throw new Error('Expected at least one mandatory field to show an invalid/error indicator, but none were found.');
  }
}

// Point 6
async verifyRemainsOnUploadPage(): Promise<void> {

  await Assertions.verifyUrlContains(
    this.page,
    'document/upload'
  );
}

// Point 5
async verifyDocumentNotUploaded(): Promise<void> {

  const toastVisible = await this.page
    .locator(this.locators.TOAST_SUCCESS_UPLOAD.value)
    .isVisible()
    .catch(() => false);

  if (toastVisible) {
    throw new Error('Document appears to have been uploaded despite missing mandatory fields.');
  }
}
  // ============================================================
  // Review Extraction Page
  // ============================================================

  async verifyReviewPageVisible(): Promise<void> {

    const topBarPage = new TopBarPage(this.page, this.runtimeData);

    await topBarPage.verifyPageTitle('Review Extraction');
  }

  async verifyPdfViewerVisible(): Promise<void> {

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.PDF_VIEWER
    );
  }

  // async verifyHtmlEditorVisible(): Promise<void> {

  //   await Assertions.verifyElementVisible(
  //     this.page,
  //     this.locators.HTML_EDITOR
  //   );
  // }
  async verifyHtmlEditorVisible() {
    await Assertions.verifyElementVisible(
        this.page,
        this.locators.HTML_EDITOR
    );
  }

  async openContentEditorCodeView(): Promise<void> {

    await Actions.click(
      this.page,
      this.locators.CODE_VIEW_BUTTON
    );

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.CODE_VIEW_TEXTAREA
    );
  }

  // list-style-type: none is an accepted exception — extraction uses it to
  // suppress default bullet markers on <ul>/<ol> elements, a legitimate
  // structural need rather than real inline styling. Everything else
  // still fails the check.
  private static readonly ALLOWED_INLINE_STYLES: string[] = [
    'list-style-type: none',
  ];

  async verifyExtractedHtmlHasNoInlineCss(): Promise<void> {

    const rawHtml = await Actions.resolve(
      this.page,
      this.locators.CODE_VIEW_TEXTAREA
    ).inputValue();

    const styleAttributeMatches = rawHtml.match(/style\s*=\s*["']([^"']*)["']/gi) ?? [];

    const disallowedMatches = styleAttributeMatches.filter((match) => {
      const value = match
        .replace(/^style\s*=\s*["']/i, '')
        .replace(/["']$/, '')
        .replace(/;+\s*$/, '')
        .trim()
        .toLowerCase();

      return !DocumentManagementPage.ALLOWED_INLINE_STYLES.includes(value);
    });

    if (disallowedMatches.length > 0) {
      throw new Error(
        `Extracted HTML contains ${disallowedMatches.length} disallowed inline style attribute(s): ` +
        disallowedMatches.slice(0, 3).join(', ') +
        (disallowedMatches.length > 3 ? ', …' : '')
      );
    }
  }

  private static normalizeToWords(text: string): string[] {

    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter(Boolean);
  }

  // Compares the source PDF's own copyable text (extracted live via
  // pdfjs-dist (see PdfTextExtractor) against the extracted HTML in the
  // Content Editor, and returns what percentage of distinct words from the
  // source PDF also appear in the extracted HTML. Works for any uploaded
  // file, not just the fixture.
  async calculateExtractionAccuracy(sourcePdfFilePath: string): Promise<number> {

    const expectedText = await PdfTextExtractor.extractText(sourcePdfFilePath);

    const actualText = await Actions.getText(
      this.page,
      this.locators.HTML_EDITOR_CONTENT
    );

    const expectedWords = new Set(DocumentManagementPage.normalizeToWords(expectedText));
    const actualWords = new Set(DocumentManagementPage.normalizeToWords(actualText ?? ''));

    if (expectedWords.size === 0) {
      throw new Error('Source PDF produced no comparable text — cannot calculate extraction accuracy.');
    }

    let matchedCount = 0;
    for (const word of expectedWords) {
      if (actualWords.has(word)) {
        matchedCount += 1;
      }
    }

    const accuracy = (matchedCount / expectedWords.size) * 100;

    console.log(
      `Extraction accuracy: ${accuracy.toFixed(2)}% (${matchedCount}/${expectedWords.size} distinct source-PDF words found in extracted HTML)`
    );

    return accuracy;
  }

  async verifyExtractionAccuracyAtLeast(sourcePdfFilePath: string, thresholdPercent: number): Promise<void> {

    const accuracy = await this.calculateExtractionAccuracy(sourcePdfFilePath);

    if (accuracy < thresholdPercent) {
      throw new Error(
        `Extraction accuracy ${accuracy.toFixed(2)}% is below the required ${thresholdPercent}% threshold.`
      );
    }
  }

  async verifyExtractionIssuesVisible(): Promise<void> {

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.EXTRACTION_ISSUES_PANEL
    );
  }

  async getExtractionIssueCount(): Promise<number> {

    return Actions.resolve(
      this.page,
      this.locators.ISSUE_ITEM_ROW
    ).count();
  }

  async selectFirstExtractionIssue(): Promise<void> {

    const issueRow = Actions.resolve(
      this.page,
      this.locators.ISSUE_ITEM_ROW
    ).first();

    await issueRow.waitFor({ state: 'visible', timeout: 30000 });
    await issueRow.click();
  }

  async clickResolveButtonForSelectedIssue(): Promise<void> {

    // The Resolve pill only renders for the selected issue (IssueItem.vue,
    // v-if="isSelected"), so exactly one is on screen at a time —
    // selectFirstExtractionIssue() must run first.
    const resolveButton = Actions.resolve(
      this.page,
      this.locators.RESOLVE_BUTTON
    ).first();

    await resolveButton.waitFor({ state: 'visible', timeout: 10000 });
    await resolveButton.click();
  }

  async verifyResolveConfirmationVisible(): Promise<void> {

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.CONFIRM_DIALOG
    );
  }

  async confirmResolveIssue(): Promise<void> {

    // No networkidle wait — same reasoning as confirmDeletion(): the
    // success toast auto-dismisses after 4s, so it must be checked
    // immediately by the caller.
    await Actions.click(
      this.page,
      this.locators.CONFIRM_BUTTON
    );
  }

  async verifyIssueResolvedSuccessMessage(): Promise<void> {

    await this.verifyToastBodyMessage('Issue resolved successfully');
  }

  // async editExtractedHtml(content: string): Promise<void> {

  //   await Actions.type(
  //     this.page,
  //     this.locators.HTML_EDITOR,
  //     content
  //   );
  // }

  async editExtractedHtml(content: string): Promise<void> {

    const codeEditor = this.page.locator(
        '[data-testid="summernote-editor"] textarea.note-codable'
    );

    if (await codeEditor.isVisible()) {
        await codeEditor.fill(content);
        return;
    }

    const richEditor = this.page.locator(
        '[data-testid="summernote-editor"] .note-editable'
    );

    await richEditor.click();
    await richEditor.press('Control+A');
    await richEditor.press('Backspace');
    await richEditor.pressSequentially(content);
  }

  async publishDocument(): Promise<void> {

    await Actions.click(
      this.page,
      this.locators.PUBLISH_BUTTON
    );

    // Wait for confirm dialog to appear with extended timeout
    try {
      await this.page
        .locator(this.locators.CONFIRM_DIALOG.value)
        .waitFor({ state: 'visible', timeout: 30000 });
    } catch (e) {
      // Dialog might not be present; try to find confirm button directly
      const confirmBtn = this.page.locator(this.locators.CONFIRM_BUTTON.value);
      await confirmBtn.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
        throw new Error('Publish confirmation dialog or button not found');
      });
    }

    // Click the confirm button
    const confirmButton = this.page.locator(this.locators.CONFIRM_BUTTON.value);
    await confirmButton.first().click();
  }

  // ============================================================
  // Extraction
  // ============================================================

  async waitForExtractionComplete(title: string): Promise<void> {
    const maxAttempts = 180; // 15 minutes with 5s polling — larger real-world CBAs (multi-MB, many pages) take longer than the small sample fixture
    const intervalMs = 5000;
    let failedRetry = false;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const result = await this.page.evaluate(async (docTitle: string) => {
        try {
          const token = (globalThis as any).localStorage?.getItem?.('auth_token');
          const headers: Record<string, string> = token
            ? { Authorization: `Bearer ${token}` }
            : {};

          const searchParams = new URLSearchParams({
            title: docTitle,
            page_size: '100',
          });

          const response = await fetch(`/api/v1/documents/?${searchParams.toString()}`, {
            headers,
          });
          if (!response.ok) return { found: false };

          const payload: any = await response.json();
          const items: any[] = Array.isArray(payload) ? payload : payload.items ?? [];
          const item = items.find((i: any) => (i.title || i.name) === docTitle);
          if (!item) return { found: false };

          return {
            found: true,
            status: (item.status ?? '').toString().toLowerCase(),
          };
        } catch (error) {
          return { found: false };
        }
      }, title);

      if (result.found) {

        if (result.status === 'extracted') {
            console.log('Extraction completed.');
            return;
        }

        if (result.status === 'failed') {

            if (!failedRetry) {

                console.log(
                    'Extraction marked as failed. Waiting for status update...'
                );

                failedRetry = true;

                await this.page.waitForTimeout(15000);

                continue;
            }

            throw new Error('Document extraction failed.');
        }
      }

      await this.page.waitForTimeout(intervalMs);
    }

    throw new Error(`Document extraction did not complete within ${maxAttempts * intervalMs / 1000} seconds for '${title}'.`);
  }


async waitForExtractionIssuesLoaded(): Promise<void> {

    // The issues panel's ProgressBar label only renders once loadingIssues
    // flips to false (ReviewExtractionPage.vue). Without this wait, a
    // 0 .issue-item count while the panel is still loading is
    // indistinguishable from "no issues left" — causing the loop below to
    // exit immediately and falsely report everything resolved.
    await Assertions.verifyElementVisible(
        this.page,
        this.locators.ISSUES_PROGRESS_LABEL,
        30000
    );
}

async waitForExtractionContentLoaded(): Promise<void> {

    await Assertions.verifyElementVisible(
        this.page,
        this.locators.HTML_EDITOR
    );

    await Assertions.verifyElementVisible(
        this.page,
        this.locators.HTML_EDITOR_CONTENT
    );
}

async resolveAllExtractionIssues(): Promise<void> {

    // await this.waitForExtractionIssuesLoaded();
    await this.waitForExtractionContentLoaded();
    await this.waitForExtractionIssuesLoaded();

    while (true) {

        const remaining = await this.getExtractionIssueCount();

        if (remaining === 0) {
            console.log('All extraction issues resolved.');
            break;
        }

        // The Resolve pill only renders for the selected issue
        // (IssueItem.vue, v-if="isSelected") — select it first.
        await this.selectFirstExtractionIssue();
        await this.clickResolveButtonForSelectedIssue();

        // Wait for confirmation dialog
        await this.page
            .locator(this.locators.CONFIRM_DIALOG.value)
            .waitFor({
                state: 'visible',
                timeout: 10000,
            });

        // Click Confirm
        await this.page
            .locator(this.locators.CONFIRM_BUTTON.value)
            .click();

      // // Wait until issue disappears
      //   await this.page.waitForLoadState('networkidle');

      //   // Small wait for Vue re-render
      //   await this.page.waitForTimeout(1000);

     const previousCount = remaining;

      while (
          (await this.getExtractionIssueCount()) >= previousCount
      ) {
          await this.page.waitForTimeout(200);
      }
    }
}
}

