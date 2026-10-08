import { Locator, Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { FormBuilderLocators } from '../locators/formBuilderObjects';
import { RuntimeData, TemplateBuilderData, TemplateBuilderQuestionData } from '../types';
import { Actions } from '../utils/actions';
import { Assertions } from '../utils/assertions';
import { TopBarPage } from './topBarPage';
import { getLogger } from '../core/logger';

const logger = getLogger('form-builder-page');

export class FormBuilderPage extends BasePage {
  private locators: FormBuilderLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new FormBuilderLocators();
  }

  async verifyFormBuilderPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(this.page, this.runtimeData);
    await topBarPage.verifyPageTitle('Survey Engine');
    await Actions.resolve(this.page, this.locators.BUILDER_CARD).waitFor({
      state: 'visible',
      timeout: 30000
    });
  }

  async buildForm(builderData: TemplateBuilderData): Promise<void> {
    for (let sectionIndex = 0; sectionIndex < builderData.sections.length; sectionIndex += 1) {
      const section = builderData.sections[sectionIndex];
      await this.addSection(section.name);
      for (const question of section.questions) {
        await this.addQuestion(question);
      }
    }
  }

  async previewAndValidate(builderData: TemplateBuilderData): Promise<void> {
    await Actions.click(this.page, this.locators.PREVIEW_BUTTON);

    const preview = Actions.resolve(this.page, this.locators.PREVIEW_MODAL);
    await preview.waitFor({ state: 'visible', timeout: 10000 });

    // Ensure the first section's tab is present and active
    const firstTab = preview.getByRole(this.locators.ROLE_TAB, { name: builderData.sections[0].name });
    await firstTab.waitFor({ state: 'visible', timeout: 10000 });

    // Wait for tab to become active 
    const waitForTabActive = async (tabLocator: Locator) => {
        const deadline = Date.now() + 5000;
        while (Date.now() < deadline) {
          const cls = (await tabLocator.getAttribute('class')) || '';
        if (cls.includes(this.locators.TAB_ACTIVE_CLASS)) return;
          await this.page.waitForTimeout(100);
        }
      };

    await waitForTabActive(firstTab);

    // Ensure the section loads and fill any provided preview answers
    await this.fillPreviewAnswers(preview, builderData.sections[0].questions, builderData);

    for (let sectionIndex = 0; sectionIndex < builderData.sections.length; sectionIndex += 1) {
      const section = builderData.sections[sectionIndex];

      if (sectionIndex > 0) {
        const tab = preview.getByRole(this.locators.ROLE_TAB, { name: section.name });
        await tab.click();
        await waitForTabActive(tab);
        await this.fillPreviewAnswers(preview, section.questions);
      }

      for (const question of section.questions) {
        const q = preview.locator(this.locators.PREVIEW_QUESTION.value).filter({ hasText: question.question });
        const firstQ = q.first();
        await firstQ.waitFor({ state: 'visible', timeout: 10000 });

        // Validate required indicator in preview if question marked required in test data
        if ((question as any).required) {
          // look for a visible star or element indicating required
          const reqSpan = firstQ.locator(this.locators.PREVIEW_REQUIRED_INDICATOR.value);
          await reqSpan.first().waitFor({ state: 'visible', timeout: 5000 });
        }

        // Validate comment box presence if question marked comment in test data
        if ((question as any).comment) {
          const commentArea = firstQ.locator(this.locators.PREVIEW_COMMENT_AREA.value);
          await commentArea.first().waitFor({ state: 'visible', timeout: 5000 });
        }

        if (question.helpText) {
          await this.verifyHelpTextInPreview(firstQ, question.helpText);
        }

      }
    }

    // Submit the preview form. Try accessible role first, fallback to text/button selector.
    try {
      await preview.getByRole(this.locators.ROLE_BUTTON, { name: this.locators.SUBMIT_BUTTON_TEXT }).click();
    } catch (err) {
      const submitBtn = preview.locator(this.locators.PREVIEW_SUBMIT_BUTTON.value).filter({ hasText: this.locators.SUBMIT_BUTTON_TEXT }).first();
      await submitBtn.waitFor({ state: 'visible', timeout: 5000 });
      await submitBtn.click();
    }

    // Assert the submitted confirmation appears inside the preview
    const submittedHeading = preview.getByText(this.locators.SUBMITTED_HEADING_TEXT, { exact: true });
    await submittedHeading.waitFor({ state: 'visible', timeout: 10000 });
    const submittedMsg = preview.getByText(this.locators.SUBMITTED_MESSAGE_TEXT, { exact: false });
    if ((await submittedMsg.count()) > 0) {
      await submittedMsg.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }

    // Click Close to dismiss the preview
    try {
      await preview.getByRole(this.locators.ROLE_BUTTON, { name: this.locators.CLOSE_BUTTON_TEXT }).click();
    } catch (err) {
      const closeBtn = this.page.locator(this.locators.PREVIEW_SUBMIT_BUTTON.value).filter({ hasText: this.locators.CLOSE_BUTTON_TEXT }).first();
      await closeBtn.waitFor({ state: 'visible', timeout: 5000 });
      await closeBtn.click();
    }

    await preview.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async saveForm(): Promise<void> {
    await Actions.click(this.page, this.locators.SAVE_BUTTON);
  }

  /**
   * Adds one or more questions to the currently active section. Used to edit an already-loaded
   * form (e.g. a reopened published template) without adding a new section.
   */
  async addQuestions(questions: TemplateBuilderQuestionData[]): Promise<void> {
    for (const question of questions) {
      await this.addQuestion(question);
    }
  }

  /**
   * Publishes an already-published template that has local edits as a NEW version. Editing a
   * published template is immutable in the builder: publishing forks a fresh draft ("Copy of …")
   * carrying the edits, then publishes that draft. This method:
   *  - clicks Publish, which raises the "Create New Version" fork-confirm dialog,
   *  - asserts and confirms that dialog (proving the previous version is not edited in place),
   *  - confirms the publish on the freshly-cloned draft.
   */
  async republishAsNewVersion(): Promise<void> {
    // Publishing a published template raises the fork-confirm dialog rather than the changelog modal.
    await Actions.click(this.page, this.locators.PUBLISH_BUTTON);
    await this.confirmCreateNewVersionDialog();

    // The cloned draft loads and (via the ?publish=1 hand-off) auto-opens the publish changelog
    // modal. If it doesn't (e.g. an autosave-triggered fork), open it manually.
    const changelogPublishButton = Actions.resolve(this.page, this.locators.CONFIRM_PUBLISH_BUTTON);
    try {
      await changelogPublishButton.waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      await Actions.click(this.page, this.locators.PUBLISH_BUTTON);
      await changelogPublishButton.waitFor({ state: 'visible', timeout: 10000 });
    }
    await changelogPublishButton.click();
  }

  private async confirmCreateNewVersionDialog(): Promise<void> {
    const dialog = Actions.resolve(this.page, this.locators.CONFIRM_DIALOG);
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    // Assert this is the new-version fork prompt — the app's guard that a published version is
    // immutable and must be forked rather than edited in place.
    const title = (
      await dialog.locator(this.locators.CONFIRM_DIALOG_TITLE.value).innerText().catch(() => '')
    ).trim();
    const message = (
      await dialog.locator(this.locators.CONFIRM_DIALOG_MESSAGE.value).innerText().catch(() => '')
    ).trim();

    if (!this.locators.NEW_VERSION_DIALOG_PATTERN.test(`${title} ${message}`)) {
      throw new Error(
        `Expected a "Create New Version" confirmation when editing a published template, ` +
          `but got title="${title}", message="${message}"`
      );
    }

    logger.info('Create New Version fork-confirm dialog verified (published version is immutable)');

    await Actions.click(this.page, this.locators.CONFIRM_DIALOG_CONFIRM);
    await dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Validates a conditional "required rule": a question that becomes mandatory only
   * when a source question is answered with a given value. Drives the preview to assert:
   *  - the target question is visible before the condition is met (and not yet required),
   *  - answering the source question makes the target mandatory (a "*" indicator appears),
   *  - submitting with the target left blank is blocked and shows a validation message.
   */
  async validateConditionalRequiredInPreview(builderData: TemplateBuilderData): Promise<void> {
    // Locate the conditionally-required (target) question and its source question from the data.
    let targetQuestion: TemplateBuilderQuestionData | undefined;
    for (const section of builderData.sections) {
      targetQuestion = section.questions.find((q) => q.requiredWhen);
      if (targetQuestion) break;
    }

    if (!targetQuestion?.requiredWhen) {
      throw new Error('No question with a conditional required rule (requiredWhen) found in builder data');
    }

    const rule = targetQuestion.requiredWhen;
    const sourceLabel = rule.sourceQuestion;
    const requiredValue = Array.isArray(rule.value) ? String(rule.value[0]) : String(rule.value);

    await Actions.click(this.page, this.locators.PREVIEW_BUTTON);

    const preview = Actions.resolve(this.page, this.locators.PREVIEW_MODAL);
    await preview.waitFor({ state: 'visible', timeout: 10000 });

    const targetContainer = preview
      .locator(this.locators.PREVIEW_QUESTION.value)
      .filter({ hasText: targetQuestion.question })
      .first();

    // 1. Target question is visible before the condition is met.
    await targetContainer.waitFor({ state: 'visible', timeout: 10000 });

    // 2. Target is not yet marked required (no "*" indicator).
    const indicatorBefore = targetContainer.locator(this.locators.PREVIEW_REQUIRED_INDICATOR.value);
    if ((await indicatorBefore.count()) > 0) {
      throw new Error(
        `"${targetQuestion.question}" should not be marked required before the condition is met`
      );
    }

    // 3. Answer the source question to satisfy the rule (e.g. select "Yes").
    const sourceContainer = preview
      .locator(this.locators.PREVIEW_QUESTION.value)
      .filter({ hasText: sourceLabel })
      .first();
    const wantNo = ['no', 'false'].includes(requiredValue.toLowerCase());
    const valueButtonName = wantNo ? this.locators.NO_BUTTON_NAME : this.locators.YES_BUTTON_NAME;
    await sourceContainer.getByRole(this.locators.ROLE_BUTTON, { name: valueButtonName }).first().click();
    await this.page.waitForTimeout(200);

    // 4. Target now shows the mandatory indicator.
    await targetContainer
      .locator(this.locators.PREVIEW_REQUIRED_INDICATOR.value)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 });

    // 5. Submit with the target left blank.
    await preview.getByRole(this.locators.ROLE_BUTTON, { name: this.locators.SUBMIT_BUTTON_TEXT }).click();

    // 6. A validation message is shown and the form is NOT submitted.
    await preview
      .getByText(this.locators.REQUIRED_VALIDATION_TEXT, { exact: false })
      .first()
      .waitFor({ state: 'visible', timeout: 5000 });

    const submittedHeading = preview.getByText(this.locators.SUBMITTED_HEADING_TEXT, { exact: true });
    if (
      (await submittedHeading.count()) > 0 &&
      (await submittedHeading.first().isVisible().catch(() => false))
    ) {
      throw new Error('Form was submitted despite a required field being left blank');
    }

    logger.info(`Conditional required rule validated for question: "${targetQuestion.question}"`);

    // Close the preview. Use exact match so the footer "Close" button is selected and not the
    // header "Close preview" (×) icon, which also matches a non-exact "Close" accessible name.
    await preview
      .getByRole(this.locators.ROLE_BUTTON, { name: this.locators.CLOSE_BUTTON_TEXT, exact: true })
      .click();
    await preview.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Validates a conditional "visibility rule" (Add Logic): a question that is hidden until a
   * source question is answered with a given value. Drives the preview to assert:
   *  - the target question is hidden before the condition is met,
   *  - answering the source question with the trigger value reveals the target,
   *  - answering with the opposite value hides the target again.
   */
  async validateConditionalVisibilityInPreview(builderData: TemplateBuilderData): Promise<void> {
    // Locate the conditionally-visible (target) question and its source question from the data.
    let targetQuestion: TemplateBuilderQuestionData | undefined;
    for (const section of builderData.sections) {
      targetQuestion = section.questions.find((q) => q.visibleWhen);
      if (targetQuestion) break;
    }

    if (!targetQuestion?.visibleWhen) {
      throw new Error('No question with a conditional visibility rule (visibleWhen) found in builder data');
    }

    const rule = targetQuestion.visibleWhen;
    const sourceLabel = rule.sourceQuestion;
    const triggerValue = Array.isArray(rule.value) ? String(rule.value[0]) : String(rule.value);

    await Actions.click(this.page, this.locators.PREVIEW_BUTTON);

    const preview = Actions.resolve(this.page, this.locators.PREVIEW_MODAL);
    await preview.waitFor({ state: 'visible', timeout: 10000 });

    const targetContainer = preview
      .locator(this.locators.PREVIEW_QUESTION.value)
      .filter({ hasText: targetQuestion.question });
    const sourceContainer = preview
      .locator(this.locators.PREVIEW_QUESTION.value)
      .filter({ hasText: sourceLabel })
      .first();

    await sourceContainer.waitFor({ state: 'visible', timeout: 10000 });

    // Clicks the Yes/No answer for the (boolean) source question.
    const answerSource = async (value: string): Promise<void> => {
      const wantNo = ['no', 'false'].includes(value.toLowerCase());
      const valueButtonName = wantNo ? this.locators.NO_BUTTON_NAME : this.locators.YES_BUTTON_NAME;
      await sourceContainer.getByRole(this.locators.ROLE_BUTTON, { name: valueButtonName }).first().click();
      await this.page.waitForTimeout(200);
    };

    // 1. Target is hidden before the condition is met.
    await this.waitForPreviewQuestionHidden(targetContainer, targetQuestion.question);

    // 2. Answering the source with the trigger value reveals the target.
    await answerSource(triggerValue);
    await targetContainer.first().waitFor({ state: 'visible', timeout: 5000 });

    // 3. Answering with the opposite value hides the target again.
    const oppositeValue = ['no', 'false'].includes(triggerValue.toLowerCase()) ? 'yes' : 'no';
    await answerSource(oppositeValue);
    await this.waitForPreviewQuestionHidden(targetContainer, targetQuestion.question);

    logger.info(`Conditional visibility rule validated for question: "${targetQuestion.question}"`);

    // Close the preview (exact match — avoid the header "Close preview" (×) icon).
    await preview
      .getByRole(this.locators.ROLE_BUTTON, { name: this.locators.CLOSE_BUTTON_TEXT, exact: true })
      .click();
    await preview.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Waits until a preview question is hidden. A hidden (conditionally-invisible) question is not
   * rendered in the DOM at all, so "hidden" means either zero matching elements or an element
   * that is present but not visible.
   */
  private async waitForPreviewQuestionHidden(container: Locator, label: string): Promise<void> {
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      if ((await container.count()) === 0) return;
      const visible = await container.first().isVisible().catch(() => false);
      if (!visible) return;
      await this.page.waitForTimeout(100);
    }
    throw new Error(`Preview question "${label}" should be hidden but is visible`);
  }

  async publishForm(): Promise<void> {
    await Actions.click(this.page, this.locators.PUBLISH_BUTTON);
    await Actions.click(this.page, this.locators.CONFIRM_PUBLISH_BUTTON);
  }

  // Clicks the section header's Copy icon. Duplication is instant (no
  // confirmation), so the new "<name> (copy)" section is verified separately
  // via verifySectionDuplicated().
  async duplicateSection(sectionName: string): Promise<void> {
    await Actions.click(this.page, this.locators.sectionDuplicateButton(sectionName));
    logger.info(`Clicked duplicate for section: "${sectionName}"`);
  }

  // Confirms the "<name> (copy)" section exists and carries over the same
  // number of questions as its source.
  async verifySectionDuplicated(sectionName: string): Promise<void> {
    const copyName = `${sectionName} (copy)`;

    const originalCountLocator = Actions.resolve(this.page, this.locators.sectionQuestionCountLabel(sectionName));
    const originalCount = (await originalCountLocator.innerText()).trim();

    const copyCountLocator = Actions.resolve(this.page, this.locators.sectionQuestionCountLabel(copyName));
    await copyCountLocator.waitFor({ state: 'visible' });
    const copyCount = (await copyCountLocator.innerText()).trim();

    if (copyCount !== originalCount) {
      throw new Error(
        `Duplicated section "${copyName}" question count mismatch. Expected "${originalCount}" but found "${copyCount}"`
      );
    }

    logger.info(`Section duplicated: "${sectionName}" -> "${copyName}" (${copyCount})`);
  }

  // Clicks the section header's Delete icon and confirms in the shared
  // confirm dialog (the same component used for template deletion).
  async deleteSection(sectionName: string): Promise<void> {
    await Actions.click(this.page, this.locators.sectionDeleteButton(sectionName));
    await Actions.click(this.page, this.locators.CONFIRM_DELETE_BUTTON);
    logger.info(`Section deleted: "${sectionName}"`);
  }

  async verifySectionNotVisible(sectionName: string): Promise<void> {
    const isVisible = await Actions.isVisible(this.page, this.locators.sectionByName(sectionName));
    if (isVisible) {
      throw new Error(`Section still visible after deletion: "${sectionName}"`);
    }
    logger.info(`Section not visible: "${sectionName}"`);
  }

  // Reads the question key input's value, retrying until it matches — the
  // key is auto-derived from the question label by an async watcher, so an
  // immediate read can race the UI update.
  async verifyQuestionKey(expectedKey: string): Promise<void> {
    await Assertions.verifyValue(this.page, this.locators.QUESTION_KEY_INPUT, expectedKey);
    logger.info(`Question key verified: "${expectedKey}"`);
  }

  async updateQuestionKey(newKey: string): Promise<void> {
    await Actions.type(this.page, this.locators.QUESTION_KEY_INPUT, newKey);
    logger.info(`Question key updated to: "${newKey}"`);
  }

  // Reloads the page to verify state (e.g. a saved key) persists across refresh.
  async reload(): Promise<void> {
    await this.page.reload();
    await this.verifyFormBuilderPageVisible();
  }

  /**
   * Clicks Publish without confirming — used for negative cases where publish validation is expected
   * to fail (e.g. a blank question label), so the changelog confirm modal never opens.
   */
  async attemptPublish(): Promise<void> {
    await Actions.click(this.page, this.locators.PUBLISH_BUTTON);
  }

  /** Opens the Add Section modal and clicks Save with a blank name (does not close the modal). */
  async attemptAddSectionWithBlankName(): Promise<void> {
    await Actions.click(this.page, this.locators.ADD_SECTION_BUTTON);
    const nameInput = Actions.resolve(this.page, this.locators.SECTION_NAME_INPUT);
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.fill('');
    await Actions.click(this.page, this.locators.SAVE_SECTION_BUTTON);
  }

  /** Asserts the section modal shows the "Section name is required" validation and stays open. */
  async verifySectionNameRequiredError(): Promise<void> {
    const error = Actions.resolve(this.page, this.locators.SECTION_MODAL_ERROR);
    await error.first().waitFor({ state: 'visible', timeout: 5000 });
    const text = (await error.first().innerText()).trim();
    if (!text.includes(this.locators.SECTION_NAME_REQUIRED_TEXT)) {
      throw new Error(
        `Expected "${this.locators.SECTION_NAME_REQUIRED_TEXT}" validation but found "${text}"`
      );
    }
  }

  async cancelSectionModal(): Promise<void> {
    await Actions.click(this.page, this.locators.CANCEL_SECTION_BUTTON);
    await Actions.resolve(this.page, this.locators.APP_MODAL)
      .waitFor({ state: 'hidden', timeout: 10000 })
      .catch(() => {});
  }

  /** Adds a section with a valid name but no questions. */
  async addEmptySection(name: string): Promise<void> {
    await this.addSection(name);
  }

  /**
   * Adds a question of the given type with a label but with its (default-seeded) options removed —
   * used to exercise the "must have at least two options" publish validation.
   */
  async addQuestionWithoutOptions(section: string, typeLabel: string, text: string): Promise<void> {
    await this.addSection(section);

    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const beforeCount = await cards.count();
    await Actions.click(this.page, this.locators.questionTypePaletteItem(typeLabel));
    await this.waitForQuestionCountGreaterThan(beforeCount);

    const card = cards.nth(beforeCount);
    await card.locator(this.locators.QUESTION_TEXT_INPUT.value).fill(text);
    await this.removeAllOptions(card);

    logger.info(`Added ${typeLabel} question "${text}" without options`);
  }

  private async removeAllOptions(card: Locator): Promise<void> {
    const removeButtons = card.locator(this.locators.OPTION_REMOVE_BUTTON.value);
    let count = await removeButtons.count();
    let guard = 0;

    while (count > 0 && guard < 12) {
      await removeButtons.first().click();

      // Each option delete is confirmed via the shared ConfirmDialog.
      const dialog = Actions.resolve(this.page, this.locators.CONFIRM_DIALOG);
      await dialog.waitFor({ state: 'visible', timeout: 5000 });
      await Actions.click(this.page, this.locators.CONFIRM_DIALOG_CONFIRM);
      await dialog.waitFor({ state: 'hidden', timeout: 5000 });

      const target = count - 1;
      const deadline = Date.now() + 5000;
      while (Date.now() < deadline) {
        if ((await removeButtons.count()) <= target) break;
        await this.page.waitForTimeout(100);
      }
      count = await removeButtons.count();
      guard += 1;
    }
  }

  /**
   * Adds a question and types an over-long label, returning the resulting (capped) text length so a
   * caller can assert the input's max-length is enforced.
   */
  async addQuestionWithLongText(
    section: string,
    typeLabel: string,
    attemptChars: number
  ): Promise<number> {
    await this.addSection(section);

    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const beforeCount = await cards.count();
    await Actions.click(this.page, this.locators.questionTypePaletteItem(typeLabel));
    await this.waitForQuestionCountGreaterThan(beforeCount);

    const card = cards.nth(beforeCount);
    const input = card.locator(this.locators.QUESTION_TEXT_INPUT.value).first();
    // Type (not fill) so the browser enforces the maxlength attribute exactly as a user would hit it.
    await input.click();
    await input.pressSequentially('a'.repeat(attemptChars), { timeout: 60000 });

    const value = await input.inputValue();
    logger.info(`Typed ${attemptChars} chars into question text; input holds ${value.length}`);
    return value.length;
  }

  /**
   * Opens the visibility-logic modal for a question and saves it WITHOUT configuring a condition
   * (no source question chosen), asserting the unconfigured rule is not persisted (the button still
   * reads "Add logic"). Note: the app only strips a rule when no source is selected — picking a
   * source auto-fills the operator and saves a rule even with a blank value.
   */
  async attemptIncompleteVisibilityLogic(childIndex: number): Promise<void> {
    // Identify the child card by index — in the builder the question text is a <textarea> value,
    // which Playwright's hasText (DOM text nodes only) cannot match.
    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const childCard = cards.nth(childIndex);
    await childCard.scrollIntoViewIfNeeded();

    await childCard
      .getByRole(this.locators.ROLE_BUTTON, { name: this.locators.LOGIC_BUTTON_NAME })
      .first()
      .click();

    const modal = Actions.resolve(this.page, this.locators.APP_MODAL);
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    // Save without choosing a source question — the seeded empty condition is stripped on save.
    await modal
      .getByRole(this.locators.ROLE_BUTTON, { name: this.locators.SAVE_BUTTON_NAME })
      .first()
      .click();
    await modal.waitFor({ state: 'hidden', timeout: 10000 });

    // The unconfigured rule must not save: the visibility button is still in its "Add logic" state.
    await childCard
      .getByRole(this.locators.ROLE_BUTTON, { name: this.locators.ADD_LOGIC_BUTTON_NAME })
      .first()
      .waitFor({ state: 'visible', timeout: 5000 });
    logger.info('Unconfigured logic rule was not saved (question still shows "Add logic")');
  }

  // Public: also used directly by section-level scenarios (duplicate/delete
  // section) that don't go through the full buildForm() flow.
  async addSection(sectionName: string): Promise<void> {
    await Actions.click(this.page, this.locators.ADD_SECTION_BUTTON);
    await Actions.type(this.page, this.locators.SECTION_NAME_INPUT, sectionName);
    await Actions.click(this.page, this.locators.SAVE_SECTION_BUTTON);
    // Wait for modal to close (if present)
    await Actions.resolve(this.page, this.locators.APP_MODAL).waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

    // Verify the section name appears inside the builder card (avoids matching modal text)
    const builder = Actions.resolve(this.page, this.locators.BUILDER_CARD);
    const sectionLocator = builder.getByText(sectionName, { exact: true });
    await sectionLocator.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  // Public: also used directly by question-level scenarios (question key
  // auto-generation) that add a single question outside of buildForm().
  // Targets whichever section is currently active (the last one added).
  async addQuestion(question: TemplateBuilderQuestionData): Promise<void> {
    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const beforeCount = await cards.count();

    await Actions.click(this.page, this.locators.questionTypePaletteItem(question.typeLabel));
    await this.waitForQuestionCountGreaterThan(beforeCount);

    const card = cards.nth(beforeCount);
    await card.locator(this.locators.QUESTION_TEXT_INPUT.value).fill(question.question);

    if (question.helpText) {
      await this.fillHelpText(card, question.helpText);
    }

    if (question.sourceListName) {
      await this.selectOptionsFromListSource(card, question.sourceListName, question.searchKeyword);
    } else if (question.options?.length) {
      await this.fillQuestionOptions(card, question.options);
    }

    if (question.required) {
      await this.toggleQuestionFooterSwitch(card, 'Required');
    }

    if (question.comment) {
      await this.toggleQuestionFooterSwitch(card, 'Comment');
    }

    if ((question as any).visibleWhen) {
      await this.addVisibilityLogic(card, (question as any).visibleWhen);
    }

    if ((question as any).requiredWhen) {
      await this.addRequiredRule(card, (question as any).requiredWhen);
    }

    // Set the key last so it overrides the label-derived default and stays locked.
    if (question.questionKey) {
      await this.setQuestionKeyOnCard(card, question.questionKey);
    }

    logger.info(`Added ${question.typeLabel} question: ${question.question}`);
  }

  /**
   * Adds a question of the given type but leaves its question-text (label) blank — used to exercise
   * the "question text required" save validation. Adds a section first so the question has a home.
   */
  async addBlankQuestion(sectionName: string, typeLabel: string): Promise<void> {
    await this.addSection(sectionName);

    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const beforeCount = await cards.count();
    await Actions.click(this.page, this.locators.questionTypePaletteItem(typeLabel));
    await this.waitForQuestionCountGreaterThan(beforeCount);

    logger.info(`Added ${typeLabel} question without entering question text`);
  }

  private async setQuestionKeyOnCard(card: Locator, key: string): Promise<void> {
    const keyInput = card.locator(this.locators.QUESTION_KEY_INPUT.value).first();
    await keyInput.waitFor({ state: 'visible', timeout: 10000 });
    await keyInput.fill(key);
    logger.info(`Set question key: "${key}"`);
  }

  /**
   * Verifies the inline "Key must be unique" error is shown on question cards — the builder flags a
   * question key that collides with another's (compared case-insensitively).
   */
  async verifyDuplicateQuestionKeyError(): Promise<void> {
    const error = Actions.resolve(this.page, this.locators.QUESTION_KEY_ERROR);
    await error.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await error.count();
    logger.info(`Duplicate question key error shown on ${count} card(s)`);
  }

  private async toggleQuestionFooterSwitch(
    card: Locator,
    label: string
  ): Promise<void> {
    const labelElement = card
      .locator(this.locators.QUESTION_REQUIRED_LABEL.value)
      .filter({ hasText: label });

    const input = labelElement.locator(this.locators.SWITCH_INPUT.value);

    await labelElement.waitFor({ state: 'visible', timeout: 10000 });
    await labelElement.scrollIntoViewIfNeeded();

    const isChecked = await input.isChecked();
    if (isChecked) {
      return;
    }

    await labelElement.click();

    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      if (await input.isChecked()) return;
      await this.page.waitForTimeout(100);
    }

      // If already checked, nothing to do
      try {
        const alreadyChecked = await input.isChecked();
        if (alreadyChecked) return;
      } catch (err) {
      }
  }
  
  private async fillQuestionOptions(card: Locator, options: string[]): Promise<void> {
    const optionInputs = card.locator(this.locators.QUESTION_OPTION_INPUT.value);
    const addButton = card.locator(this.locators.ADD_OPTION_BUTTON.value).first();

    // Ensure enough option rows exist by clicking the "+ Add option" button
    for (let index = 0; index < options.length; index += 1) {
      const currentCount = await optionInputs.count();
      if (index >= currentCount) {
        await addButton.scrollIntoViewIfNeeded();
        await addButton.click();

        // wait for the new input to appear
        const deadline = Date.now() + 5000;
        while (Date.now() < deadline) {
          if ((await optionInputs.count()) > index) break;
          await this.page.waitForTimeout(100);
        }
      }

      await optionInputs.nth(index).fill(options[index]);
    }
  }

  private async addVisibilityLogic(card: Locator, rule: { sourceQuestion: string; value: string; operator?: string }): Promise<void> {
    // Click the 'Add logic' button on the card (button text: 'Add logic' or 'Edit logic')
    const logicBtn = card.getByRole(this.locators.ROLE_BUTTON, { name: this.locators.LOGIC_BUTTON_NAME }).first();
    await logicBtn.scrollIntoViewIfNeeded();
    await logicBtn.click();
    await this.fillRuleModal(rule);
  }

  private async addRequiredRule(card: Locator, rule: { sourceQuestion: string; value: string; operator?: string }): Promise<void> {
    // Click the 'Add required rule' button on the card (text: 'Add required rule' or 'Edit required rule').
    // This opens the same VisibilityRuleModal (mode="required") used by visibility logic, so the
    // condition-row interaction is identical.
    const requiredBtn = card.getByRole(this.locators.ROLE_BUTTON, { name: this.locators.REQUIRED_RULE_BUTTON_NAME }).first();
    await requiredBtn.scrollIntoViewIfNeeded();
    await requiredBtn.click();
    await this.fillRuleModal(rule);
  }

  private async fillRuleModal(rule: { sourceQuestion: string; value: string; operator?: string }): Promise<void> {
    // Wait for modal
    const modal = Actions.resolve(this.page, this.locators.APP_MODAL);
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    // Select source question (match by visible text as a fallback)
    const sourceTrigger = modal.getByRole(this.locators.ROLE_BUTTON, { name: this.locators.CHOOSE_QUESTION_NAME }).first();
    await sourceTrigger.waitFor({ state: 'visible', timeout: 5000 });
    await sourceTrigger.click();
    // Prefer exact option match, fall back to option that contains the text
    const optionByText = this.page.getByRole(this.locators.ROLE_OPTION).filter({ hasText: rule.sourceQuestion }).first();
    if ((await optionByText.count()) > 0) {
      await optionByText.click();
    } else {
      await this.page.getByRole(this.locators.ROLE_OPTION, { name: rule.sourceQuestion }).click().catch(() => {});
    }

    // Select operator (default to equals)
    const operatorTrigger = modal.locator(this.locators.LOGIC_MODAL_FIELD.value).nth(1).getByRole(this.locators.ROLE_BUTTON).first();
    await operatorTrigger.waitFor({ state: 'visible', timeout: 5000 });
    await operatorTrigger.click();
    const operatorName = rule.operator || 'equals';
    await this.page.getByRole(this.locators.ROLE_OPTION, { name: operatorName }).click();

    const rawValue = rule.value as string | string[];
    const normalized = Array.isArray(rawValue) ? String(rawValue[0]).toLowerCase() : String(rawValue || '').toLowerCase();

    // Try matching a modal button with the exact visible text
    const modalValueBtn = modal.getByRole(this.locators.ROLE_BUTTON).filter({ hasText: new RegExp(`^${String(rawValue) }$`, 'i') }).first();
    if ((await modalValueBtn.count()) > 0) {
      await modalValueBtn.click();
    } else {
      // Handle common boolean rendering (Yes / No)
      if (['yes', 'no', 'true', 'false'].includes(normalized)) {
        const booleanText = normalized === 'true' ? 'yes' : normalized;
        const boolBtn = modal.getByRole(this.locators.ROLE_BUTTON).filter({ hasText: new RegExp(`^${booleanText}$`, 'i') }).first();
        if ((await boolBtn.count()) > 0) {
          await boolBtn.click();
        }
      } else {
        // fallback: open the 'Choose option' select inside the modal
        const chooseOptionTrigger = modal.getByRole(this.locators.ROLE_BUTTON, { name: this.locators.CHOOSE_OPTION_NAME }).first();
        if ((await chooseOptionTrigger.count()) > 0) {
          await chooseOptionTrigger.click();
          const opt = this.page.getByRole(this.locators.ROLE_OPTION).filter({ hasText: String(rawValue) }).first();
          if ((await opt.count()) > 0) {
            await opt.click();
          } else {
            await this.page.getByRole(this.locators.ROLE_OPTION, { name: String(rawValue) }).click().catch(() => {});
          }
        } else {
          // fallback to typing value into an input inside modal
          const valueInput = modal.locator(this.locators.LOGIC_VALUE_INPUT.value).first();
          await valueInput.fill(String(rawValue || ''));
        }
      }
    }

    // Wait for Save button to be enabled and click it
    const saveBtn = modal.getByRole(this.locators.ROLE_BUTTON, { name: this.locators.SAVE_BUTTON_NAME }).first();
    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      if (await saveBtn.isEnabled()) break;
      await this.page.waitForTimeout(100);
    }
    await saveBtn.click();
    await modal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  private async waitForQuestionCountGreaterThan(count: number): Promise<void> {
    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const deadline = Date.now() + 10000;

    while (Date.now() < deadline) {
      if ((await cards.count()) > count) return;
      await this.page.waitForTimeout(100);
    }

    throw new Error(`Expected question count to be greater than ${count}`);
  }

  private async fillPreviewTextAnswer(preview: Locator, questionLabel: string, answer: string): Promise<void> {
    const question = preview.locator(this.locators.PREVIEW_QUESTION.value).filter({ hasText: questionLabel });

    // Wait for an input/textarea to appear within the question container
    let input = question.locator(this.locators.PREVIEW_TEXT_INPUT.value).first();
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      try {
        if ((await input.count()) > 0 && (await input.isVisible().catch(() => false))) break;
      } catch (_) {
        // ignore intermittent errors and retry until deadline
      }
      await this.page.waitForTimeout(100);
      input = question.locator(this.locators.PREVIEW_FALLBACK_INPUT.value).first();
    }

    if ((await input.count()) === 0) {
      logger.warn(`Could not find text input for preview question: "${questionLabel}"`);
      throw new Error(`Could not find text input for preview question: "${questionLabel}"`);
    }

    try {
      await input.fill(answer);
    } catch (err) {
      logger.error(`Failed filling preview text answer for "${questionLabel}": ${String(err)}`);
      throw err;
    }
  }

  private async fillPreviewAnswer(preview: Locator, question: TemplateBuilderQuestionData, builderData?: TemplateBuilderData): Promise<void> {
    if (!question.previewAnswer) return;
    const q = preview.locator(this.locators.PREVIEW_QUESTION.value).filter({ hasText: question.question }).first();
    const ans = question.previewAnswer as any;

    // Handle by typeLabel
    const t = question.typeLabel.toLowerCase();
    if (t.includes('short') || t.includes('paragraph') || t === 'html editor') {
      const input = q.locator(this.locators.PREVIEW_TEXT_INPUT.value);
      await input.first().fill(String(ans));
      return;
    }

    if (t.includes('number')) {
      await q.locator(this.locators.PREVIEW_NUMBER_INPUT.value).fill(String(ans));
      return;
    }

    if (t.includes('date')) {
      const dateVal = String(ans); // e.g. 2024-01-01

      try {
        const [year, month, day] = dateVal.split('-').map(Number);

        // Open date picker
        const trigger = q.locator(this.locators.DATE_TRIGGER.value).first();

        await trigger.waitFor({
          state: 'visible',
          timeout: 5000
        });

        await trigger.click();

        const datePicker = Actions.resolve(this.page, this.locators.DATE_PICKER);

        await datePicker.waitFor({
          state: 'visible',
          timeout: 5000
        });

        // -----------------------------
        // Select year
        // -----------------------------
        await datePicker
          .locator(this.locators.DATE_YEAR_OVERLAY.value)
          .click();

        const yearOption = this.page
          .locator(this.locators.DATE_OVERLAY_CELL.value)
          .filter({ hasText: String(year) })
          .first();

        await yearOption.waitFor({
          state: 'visible',
          timeout: 5000
        });

        await yearOption.click();

        // -----------------------------
        // Select month
        // -----------------------------
        await datePicker
          .locator(this.locators.DATE_MONTH_OVERLAY.value)
          .click();

        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ];

        const monthOption = this.page
          .locator(this.locators.DATE_OVERLAY_CELL.value)
          .filter({ hasText: monthNames[month - 1] })
          .first();

        await monthOption.waitFor({
          state: 'visible',
          timeout: 5000
        });

        await monthOption.click();

        // -----------------------------
        // Select day
        // -----------------------------
        const targetDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const dayCell = datePicker.locator(
          this.locators.dateCellByValue(targetDate).value
        );

        await dayCell.waitFor({
          state: 'visible',
          timeout: 5000
        });

        await dayCell.click();

        await this.page.waitForTimeout(300);

        logger.info(
          `Selected date "${dateVal}" for question "${question.question}"`
        );

        return;
      } catch (err) {
        logger.error(
          `Failed selecting date "${dateVal}" for question "${question.question}": ${String(err)}`
        );

        throw err;
      }
    }

    if (t.includes('multiple choice') || t.includes('radio')) {
      // click the radio option matching ans
      await q.getByRole(this.locators.ROLE_RADIO, { name: String(ans) }).first().click();
      return;
    }

    if (t === 'yes / no' || t === 'yes/no' || t.includes('yes')) {
      // ans expected as 'yes' or 'no' — click only the matching button and guard existence
      const normalizedAns = String(ans || '').toLowerCase();
      const wantNo = normalizedAns === 'no' || normalizedAns === 'false';
      const btnName = wantNo ? this.locators.NO_BUTTON_NAME : this.locators.YES_BUTTON_NAME;

      const candidate = q.getByRole('button', { name: btnName }).first();
      if ((await candidate.count()) > 0) {
        await candidate.click();
        // brief pause to allow UI to react and reveal/hide dependent questions
        await this.page.waitForTimeout(150);
      } else {
        // fallback: try clicking on labels containing Yes/No text
        const textBtn = q.getByText(wantNo ? this.locators.NO_BUTTON_TEXT : this.locators.YES_BUTTON_TEXT, { exact: true }).first();
        if ((await textBtn.count()) > 0) {
          await textBtn.click();
          await this.page.waitForTimeout(150);
        }
      }
      return;
    }
    
    if (t.includes('multi')) {
      const values = Array.isArray(ans) ? ans : [ans];
      const combobox = q.locator('[role="combobox"]').first();

      await combobox.click();
      const panel = this.page.locator('.ms-panel[role="listbox"]').first();
      await panel.waitFor({ state: 'visible', timeout: 5000 });

      for (const v of values) {
        const val = String(v);
        try {
          const searchInput = panel.locator('.ms-search__input').first();
          await searchInput.fill(val);

          const opt = panel.locator('.ms-option').filter({
            has: this.page.locator('.ms-option__label', { hasText: new RegExp(`^${val}$`, 'i') })
          }).first();

          await opt.waitFor({ state: 'visible', timeout: 5000 });
          await opt.click();
          await this.page.waitForTimeout(150);

          await searchInput.fill('');
        } catch (err) {
          logger.warn(`Failed selecting multi-select option "${val}" for question "${question.question}": ${String(err)}`);
          throw err;
        }
      }

      await q.click({ position: { x: 5, y: 5 } });
      await this.page.waitForTimeout(200);
      return;
    }

    if (t.includes('dropdown') || t.includes('select')) {
      // Handle multi-selects (arrays) and single selects
      const values = Array.isArray(ans) ? ans : [ans];
      const trigger = q.getByRole(this.locators.ROLE_BUTTON).filter({ hasText: this.locators.SELECT_TRIGGER_TEXT }).first();

      for (const v of values) {
        const val = String(v);
        try {
          if ((await trigger.count()) > 0) {
            await trigger.click();
            // Wait for options to appear and click the correct one
            const opt = this.page.getByRole(this.locators.ROLE_OPTION, { name: val }).first();
            if ((await opt.count()) > 0) {
              await opt.click();
            } else {
              // fallback: try matching by text nodes
              const optText = this.page.getByText(val).first();
              if ((await optText.count()) > 0) await optText.click();
              else await this.page.getByRole(this.locators.ROLE_OPTION, { name: val }).click().catch(() => {});
            }
            // small pause between selections
            await this.page.waitForTimeout(150);
          } else {
            // fallback: try clicking option label inside question container
            const inside = q.getByText(val).first();
            if ((await inside.count()) > 0) {
              await inside.click();
            } else {
              // final fallback: try a general page option click
              await this.page.getByRole(this.locators.ROLE_OPTION, { name: val }).click();
            }
          }
        } catch (err) {
          logger.warn(`Failed selecting option "${val}" for question "${question.question}": ${String(err)}`);
          throw err;
        }
      }
      return;
    }

    // fallback: try text input
    await this.fillPreviewTextAnswer(preview, question.question, String(ans));
  }

  private async fillPreviewAnswers(preview: Locator, questions: TemplateBuilderQuestionData[], builderData?: TemplateBuilderData): Promise<void> {
    for (const question of questions) {
      if (!question.previewAnswer) continue;
      try {
        await this.fillPreviewAnswer(preview, question, builderData);
      } catch (err) {
        logger.error(`Error filling preview answer for question "${question.question}": ${String(err)}`);
        throw err;
      }
    }
  }

  private async fillHelpText(card: Locator, helpText: string): Promise<void> {
    const helpTextInput = card.locator(this.locators.HELP_TEXT_INPUT.value).first();
    await helpTextInput.waitFor({ state: 'visible', timeout: 5000 });
    await helpTextInput.fill(helpText);
    logger.info(`Filled help text: "${helpText}"`);
  }

  private async verifyHelpTextInPreview(questionLocator: Locator, expectedHelpText: string): Promise<void> {
    const infoIcon = questionLocator.locator(this.locators.PREVIEW_HELP_TEXT_ICON.value).first();

    await infoIcon.waitFor({ state: 'visible', timeout: 5000 });

    // hover to trigger tooltip
    await infoIcon.hover();
    await this.page.waitForTimeout(500);

    // find tooltip and verify text
    const tooltip = this.page.locator(this.locators.PREVIEW_HELP_TEXT_TOOLTIP.value).first();
    await tooltip.waitFor({ state: 'visible', timeout: 5000 });

    const tooltipText = (await tooltip.innerText()).trim();
    if (!tooltipText.includes(expectedHelpText)) {
      throw new Error(
        `Help text mismatch for question.\nExpected: "${expectedHelpText}"\nActual: "${tooltipText}"`
      );
    }

    // move mouse away to dismiss tooltip before continuing
    await this.page.mouse.move(0, 0);
    await this.page.waitForTimeout(300);

    logger.info(`Help text verified: "${expectedHelpText}"`);
  }

  
  async duplicateQuestionByText(questionText: string): Promise<void> {
    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const beforeCount = await cards.count();

    const card = await this.getQuestionCardByText(questionText);
    const originalIndex = await this.getCardIndex(card);

    const duplicateBtn = card.locator(this.locators.DUPLICATE_QUESTION_BUTTON.value).first();
    await duplicateBtn.scrollIntoViewIfNeeded();
    await duplicateBtn.click();

    await this.waitForQuestionCountGreaterThan(beforeCount);

    this.runtimeData.lastDuplicatedFromIndex = originalIndex;
    logger.info(`Duplicated question: "${questionText}"`);
  }

  async verifyDuplicateQuestionBelowOriginal(questionText: string, expectedTypeLabel: string): Promise<void> {
    const originalIndex: number = this.runtimeData.lastDuplicatedFromIndex;
    if (originalIndex === undefined || originalIndex === null) {
      throw new Error('No duplicated question tracked — call duplicateQuestionByText first');
    }

    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const count = await cards.count();
    const duplicateIndex = originalIndex + 1;

    if (duplicateIndex >= count) {
      throw new Error(
        `Expected a duplicated card at index ${duplicateIndex} (below original at ${originalIndex}), but only ${count} cards exist`
      );
    }

    const duplicateCard = cards.nth(duplicateIndex);

    // Expand the duplicate card if collapsed — its label-row (question text) is
    // v-if gated and doesn't exist in the DOM at all until expanded.
    const chevron = duplicateCard.locator('button[aria-label="Collapse question"], button[aria-label="Expand question"]').first();
    if ((await chevron.count()) > 0) {
      const expandedAttr = await chevron.getAttribute('aria-expanded');
      if (expandedAttr === 'false') {
        await chevron.scrollIntoViewIfNeeded();
        await chevron.click();
        await this.page.waitForTimeout(300);
      }
    }

    // Verify question text matches the expected original text, allowing the
    // application-specific copied label suffix appended by the form builder.
    const input = duplicateCard.locator(this.locators.QUESTION_TEXT_INPUT.value);
    await input.waitFor({ state: 'visible', timeout: 5000 });
    const actualText = (await input.inputValue()).trim();
    const expectedText = questionText.trim();
    const isValidDuplicateText =
      actualText === expectedText ||
      actualText === `${expectedText} (copy)` ||
      actualText.startsWith(`${expectedText} (copy)`);

    if (!isValidDuplicateText) {
      throw new Error(
        `Expected duplicated question text to start with "${expectedText}" but found "${actualText}" at index ${duplicateIndex}`
      );
    }

    // Verify question type matches
    const duplicateTypeLabel = duplicateCard.locator('.qts__trigger .text-brand-dark').first();
    await duplicateTypeLabel.waitFor({ state: 'visible', timeout: 5000 });
    const actualType = (await duplicateTypeLabel.innerText()).trim();
    if (actualType !== expectedTypeLabel) {
      throw new Error(
        `Expected duplicated question type to be "${expectedTypeLabel}" but found "${actualType}"`
      );
    }

    logger.info(`Verified duplicate of "${questionText}" appears below original (index ${duplicateIndex}) with matching type "${expectedTypeLabel}"`);
  }

  private async getCardIndex(card: Locator): Promise<number> {
    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const count = await cards.count();
    for (let i = 0; i < count; i += 1) {
      const isSame = await cards.nth(i).evaluate(
        (el, target) => el === target,
        await card.elementHandle()
      );
      if (isSame) return i;
    }
    throw new Error('Could not determine index of question card');
  }

  private async selectOptionsFromListSource(card: Locator, sourceListName: string, searchKeyword?: string): Promise<void> {
      let fromListButton = card.getByRole(this.locators.ROLE_BUTTON, { name: /From List/i }).first();
      if ((await fromListButton.count()) === 0) {
        fromListButton = card.locator('button:has-text("From list")').first();
      }

      if ((await fromListButton.count()) > 0) {
        await fromListButton.scrollIntoViewIfNeeded();
        await fromListButton.click();
      }

      let listTrigger = card.locator('button.select-trigger').first();
      if ((await listTrigger.count()) === 0) {
        listTrigger = card.getByRole(this.locators.ROLE_BUTTON, { name: /Select a list/i }).first();
      }

      await listTrigger.scrollIntoViewIfNeeded();
      await listTrigger.click();

      const panel = this.page.locator('div.select-panel[role="listbox"]').first();
      await panel.waitFor({ state: 'visible', timeout: 5000 });

      // Try the exact option directly — the unfiltered list already contains it,
      // so we avoid the search/filter race entirely.
      const exactOption = panel.locator('button[role="option"]').filter({
        hasText: new RegExp(`^${sourceListName}$`, 'i')
      }).first();

      try {
        await exactOption.waitFor({ state: 'visible', timeout: 8000 });
        await exactOption.click();
        await this.page.waitForTimeout(300);
        return;
      } catch (err) {
        logger.warn(`Exact option "${sourceListName}" not immediately visible, falling back to search`);
      }

      // Fallback: use the search box only if the exact option wasn't found unfiltered
      const searchInput = panel.locator('input.select-search__input, input[placeholder*="Search"]').first();
      if ((await searchInput.count()) > 0) {
        await searchInput.fill(searchKeyword || sourceListName);

        const filteredOption = panel.locator('button[role="option"]').filter({
          hasText: new RegExp(`^${sourceListName}$`, 'i')
        }).first();

        await filteredOption.waitFor({ state: 'visible', timeout: 8000 });
        await filteredOption.click();
        await this.page.waitForTimeout(300);
        return;
      }

      throw new Error(`Could not select source list option: ${sourceListName}`);
    }

    async buildFormWithLogic(builderData: TemplateBuilderData): Promise<void> {
    await this.buildForm(builderData);
  }

  async validateLogicInPreview(
    sectionName: string,
    triggerQuestion: string,
    dependentQuestion: string,
    triggerAnswer: string
  ): Promise<void> {
    await Actions.click(this.page, this.locators.PREVIEW_BUTTON);

    const preview = Actions.resolve(this.page, this.locators.PREVIEW_MODAL);
    await preview.waitFor({ state: 'visible', timeout: 10000 });

    const tab = preview.getByRole(this.locators.ROLE_TAB, { name: sectionName });
    await tab.waitFor({ state: 'visible', timeout: 10000 });

    // Step 1: dependent question should NOT be visible before the trigger is answered
    const dependentLocator = preview.locator(this.locators.PREVIEW_QUESTION.value).filter({ hasText: dependentQuestion });
    const initiallyVisible = (await dependentLocator.count()) > 0 && (await dependentLocator.first().isVisible().catch(() => false));
    if (initiallyVisible) {
      throw new Error(`Expected question "${dependentQuestion}" to be hidden before answering "${triggerQuestion}", but it is visible`);
    }
    logger.info(`Confirmed "${dependentQuestion}" is hidden before trigger is answered`);

    // Step 2: answer the trigger question
    const triggerLocator = preview.locator(this.locators.PREVIEW_QUESTION.value).filter({ hasText: triggerQuestion }).first();
    await triggerLocator.waitFor({ state: 'visible', timeout: 10000 });

    const normalizedAns = triggerAnswer.toLowerCase();
    const wantNo = normalizedAns === 'no';
    const btnName = wantNo ? this.locators.NO_BUTTON_NAME : this.locators.YES_BUTTON_NAME;

    const candidate = triggerLocator.getByRole(this.locators.ROLE_BUTTON, { name: btnName }).first();
    if ((await candidate.count()) > 0) {
      await candidate.click();
    } else {
      const textBtn = triggerLocator.getByText(wantNo ? this.locators.NO_BUTTON_TEXT : this.locators.YES_BUTTON_TEXT, { exact: true }).first();
      await textBtn.click();
    }
    await this.page.waitForTimeout(300);
    logger.info(`Answered "${triggerAnswer}" for "${triggerQuestion}"`);

    // Step 3: dependent question should now become visible
    await dependentLocator.first().waitFor({ state: 'visible', timeout: 5000 });
    logger.info(`Confirmed "${dependentQuestion}" is now visible after answering "${triggerQuestion}"`);

    // Close preview
    try {
      await preview.getByRole(this.locators.ROLE_BUTTON, { name: this.locators.CLOSE_BUTTON_TEXT }).click();
    } catch (err) {
      const closeBtn = this.page.locator(this.locators.PREVIEW_SUBMIT_BUTTON.value).filter({ hasText: this.locators.CLOSE_BUTTON_TEXT }).first();
      await closeBtn.waitFor({ state: 'visible', timeout: 5000 });
      await closeBtn.click();
    }
    await preview.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async deleteQuestionByText(questionText: string): Promise<void> {
    const card = await this.getQuestionCardByText(questionText);

    const deleteBtn = card.locator(this.locators.DELETE_QUESTION_BUTTON.value).first();
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.click();

    const confirmBtn = this.page.locator(this.locators.CONFIRM_DELETE_QUESTION_BUTTON.value).first();
    await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
    await confirmBtn.click();

    logger.info(`Deleted question: "${questionText}"`);
  }

  async verifyQuestionDeleted(questionText: string): Promise<void> {
    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const count = await cards.count();

    for (let i = 0; i < count; i += 1) {
      const card = cards.nth(i);
      const input = card.locator(this.locators.QUESTION_TEXT_INPUT.value);
      const value = await input.inputValue().catch(() => '');
      if (value.trim() === questionText.trim()) {
        throw new Error(`Expected question "${questionText}" to be deleted but it still exists`);
      }
    }

    logger.info(`Verified question deleted and not present: "${questionText}"`);
  }

  private async getQuestionCardByText(questionText: string): Promise<Locator> {
    const cards = Actions.resolve(this.page, this.locators.QUESTION_CARDS);
    const count = await cards.count();

    for (let i = 0; i < count; i += 1) {
      const card = cards.nth(i);
      const input = card.locator(this.locators.QUESTION_TEXT_INPUT.value);
      const value = await input.inputValue().catch(() => '');
      if (value.trim() === questionText.trim()) {
        return card;
      }
    }

    throw new Error(`Could not find question card with text: "${questionText}"`);
  }

  async addStandaloneQuestion(typeLabel: string, questionText: string): Promise<void> {
    await this.addQuestion({ typeLabel, question: questionText } as TemplateBuilderQuestionData);
  }


}
