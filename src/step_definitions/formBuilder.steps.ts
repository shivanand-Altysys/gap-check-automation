import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import {
  DuplicateKeyFormData,
  IncompleteLogicData,
  OvertimeLegalQuestion,
  RequiredRuleFormData,
  TemplateBuilderFormData,
  VersioningBaseFormData,
  VisibilityRuleFormData,
  TemplateBuilderLogicData,
  TemplateBuilderMultiSelectFromListData
} from '../data/templateData';
import { FormBuilderPage } from '../pages/formBuilderPage';

Then('I should see the Form Builder page', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.verifyFormBuilderPageVisible();
});

When(
  'I build the survey form with all question types and logic',
  { timeout: 300000 },
  async function (this: CustomWorld) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.buildForm(TemplateBuilderFormData);
  }
);

When('I validate the survey form in preview', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.previewAndValidate(TemplateBuilderFormData);
});

When(
  'I build the survey form with a conditional required rule',
  { timeout: 600000 },
  async function (this: CustomWorld) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.buildForm(RequiredRuleFormData);
  }
);

When('I validate the conditional required rule in preview', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.validateConditionalRequiredInPreview(RequiredRuleFormData);
});

When(
  'I build the survey form with a conditional visibility rule',
  { timeout: 120000 },
  async function (this: CustomWorld) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.buildForm(VisibilityRuleFormData);
  }
);

When('I validate the conditional visibility rule in preview', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.validateConditionalVisibilityInPreview(VisibilityRuleFormData);
});

When(
  'I build a publishable survey form',
  { timeout: 120000 },
  async function (this: CustomWorld) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.buildForm(VersioningBaseFormData);
  }
);

When('I add a question in the form builder', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.addQuestions([OvertimeLegalQuestion]);
});

When('I publish the edited template as a new version', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.republishAsNewVersion();
});

When(
  'I build the survey form with duplicate question keys',
  { timeout: 120000 },
  async function (this: CustomWorld) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.buildForm(DuplicateKeyFormData);
  }
);

Then(
  'I should see the duplicate question key error on the question cards',
  async function (this: CustomWorld) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.verifyDuplicateQuestionKeyError();
  }
);

When(
  'I add a {string} question without entering question text',
  async function (this: CustomWorld, typeLabel: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.addBlankQuestion('Working Hours', typeLabel);
  }
);

// --- SE_BUILDER_034: negative validation cases ---

When('I attempt to add a section with a blank name', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.attemptAddSectionWithBlankName();
});

Then('I should see the section name required validation', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.verifySectionNameRequiredError();
});

When('I cancel the section modal', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.cancelSectionModal();
});

When('I add a section named {string}', async function (this: CustomWorld, name: string) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.addEmptySection(name);
});

When(
  'I add a {string} question with text {string} and no options',
  async function (this: CustomWorld, typeLabel: string, text: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.addQuestionWithoutOptions('Overtime', typeLabel, text);
  }
);

When(
  'I build the survey form for an incomplete logic rule',
  { timeout: 120000 },
  async function (this: CustomWorld) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.buildForm(IncompleteLogicData);
  }
);

When('I attempt to configure a logic rule with no condition', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  // The dependent question is the 2nd card (index 1).
  await page.attemptIncompleteVisibilityLogic(1);
});

When(
  'I add a {string} question with a {int} character text',
  { timeout: 120000 },
  async function (this: CustomWorld, typeLabel: string, chars: number) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    const length = await page.addQuestionWithLongText('Working Hours', typeLabel, chars);
    this.setData('lastQuestionTextLength', length);
  }
);

Then(
  'the question text should be capped at {int} characters',
  async function (this: CustomWorld, maxChars: number) {
    const length = this.getData('lastQuestionTextLength') as number | undefined;
    if (length === undefined) {
      throw new Error('No question text length was recorded');
    }
    if (length > maxChars) {
      throw new Error(`Expected question text to be capped at ${maxChars} chars but got ${length}`);
    }
  }
);

When('I save the survey form builder', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.saveForm();
});

When('I publish the survey form builder', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.publishForm();
});

/**
 * Adds a new section; it becomes the active section that subsequent
 * "add question" steps target.
 */
When(
  'I add a section {string} to the form builder',
  async function (this: CustomWorld, sectionName: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.addSection(sectionName);
  }
);

/**
 * Adds a question of the given type to whichever section is currently active.
 */
When(
  'I add a {string} question {string} to the current section',
  async function (this: CustomWorld, typeLabel: string, questionText: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.addQuestion({ typeLabel, question: questionText });
  }
);

When('I duplicate section {string}', async function (this: CustomWorld, sectionName: string) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.duplicateSection(sectionName);
});

Then(
  'I should see a duplicated section for {string}',
  async function (this: CustomWorld, sectionName: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.verifySectionDuplicated(sectionName);
  }
);

When('I delete section {string}', async function (this: CustomWorld, sectionName: string) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.deleteSection(sectionName);
});

Then(
  'I should not see section {string} in the form builder',
  async function (this: CustomWorld, sectionName: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.verifySectionNotVisible(sectionName);
  }
);

Then('the question key should be {string}', async function (this: CustomWorld, expectedKey: string) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.verifyQuestionKey(expectedKey);
});

When('I update the question key to {string}', async function (this: CustomWorld, newKey: string) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.updateQuestionKey(newKey);
});

When('I reload the form builder page', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.reload();
});

When('I attempt to publish the survey form builder', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.attemptPublish();
});


When(
  'I build the survey form with multi-select from list',
  { timeout: 300000 },
  async function (this: CustomWorld) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.buildForm(TemplateBuilderMultiSelectFromListData);
  }
);

When('I validate the survey form in preview for multi-select from list', async function (this: CustomWorld) {
  const page = new FormBuilderPage(this.page!, this.runtimeData);
  await page.previewAndValidate(TemplateBuilderMultiSelectFromListData);
});

When(
  'I build the survey form with add logic between questions',
  { timeout: 300000 },
  async function (this: CustomWorld) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.buildFormWithLogic(TemplateBuilderLogicData);
  }
);

Then(
  'I should see Question 2 hidden initially and visible after answering Question 1',
  { timeout: 60000 },
  async function (this: CustomWorld) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.validateLogicInPreview(
      'Working Hours',
      'Does the agreement have clauses on standard working hours?',
      'Are working hours per day agreed?',
      'yes'
    );
  }
);

When(
  'I add a question {string} in the existing section',
  async function (this: CustomWorld, questionText: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.addStandaloneQuestion('Dropdown', questionText);
  }
);

When(
  'I delete question {string}',
  async function (this: CustomWorld, questionText: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.deleteQuestionByText(questionText);
  }
);

Then(
  'I should not see question {string} in the section',
  async function (this: CustomWorld, questionText: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.verifyQuestionDeleted(questionText);
  }
);

When(
  'I add a {string} question with text {string} in the existing section',
  async function (this: CustomWorld, typeLabel: string, questionText: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.addStandaloneQuestion(typeLabel, questionText);
  }
);

When(
  'I click duplicate for question {string}',
  async function (this: CustomWorld, questionText: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.duplicateQuestionByText(questionText);
  }
);

Then(
  'I should see the duplicated {string} question {string} below the original',
  async function (this: CustomWorld, typeLabel: string, questionText: string) {
    const page = new FormBuilderPage(this.page!, this.runtimeData);
    await page.verifyDuplicateQuestionBelowOriginal(questionText, typeLabel);
  }
);
