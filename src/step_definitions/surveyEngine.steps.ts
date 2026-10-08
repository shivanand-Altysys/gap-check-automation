import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { SurveyTemplatesPage } from '../pages/surveyEnginePage';

function resolveTemplateName(world: CustomWorld, type: string): string {
  let name: string | undefined;

  switch (type.toLowerCase()) {
    case 'created':
      name = world.getData('createdTemplate')?.templateName;
      break;
    default:
      name = type;
      break;
  }

  if (!name) throw new Error(`Template name missing for type "${type}"`);

  return name;
}

When('I click the Add Template button on Survey Engine page', async function (this: CustomWorld) {
  const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
  await page.clickAddTemplate();
});

Then('I should see the Survey Engine page', async function (this: CustomWorld) {
  const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
  await page.verifySurveyTemplatesPageVisible();
});

/**
 * Delete created template
 */
When(
  'I delete {string} template',
  async function (this: CustomWorld, type: string): Promise<void> {
    const name = resolveTemplateName(this, type);
    const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
    await page.deleteTemplateByName(name);
  }
);

/**
 * Verify template exists
 */
Then(
  'I should see {string} template in the list',
  async function (this: CustomWorld, type: string): Promise<void> {
    const name = resolveTemplateName(this, type);
    const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
    await page.verifyTemplateInTable(name);
  }
);

When(
  'I record the published version of {string} template',
  async function (this: CustomWorld, type: string): Promise<void> {
    const name = resolveTemplateName(this, type);
    const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
    const version = await page.getTemplateVersion(name);
    if (version === null) {
      throw new Error(`Could not read a published version for template "${name}"`);
    }
    this.setData('baselineVersion', version);
  }
);

Then(
  'the latest published version of {string} template should be newer than the recorded version',
  async function (this: CustomWorld, type: string): Promise<void> {
    const name = resolveTemplateName(this, type);
    const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
    const baseline = this.getData('baselineVersion') as number | undefined;

    if (baseline === undefined) {
      throw new Error('No baseline version was recorded before this comparison');
    }
    // Polls until the newly published version appears (the list may still be loading after
    // navigating back from the builder); throws with detail if it never exceeds the baseline.
    await page.waitForLatestTemplateVersionAbove(name, baseline);
  }
);

Then(
  'the previously published version of {string} template should still be available',
  async function (this: CustomWorld, type: string): Promise<void> {
    const name = resolveTemplateName(this, type);
    const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
    const baseline = this.getData('baselineVersion') as number | undefined;

    if (baseline === undefined) {
      throw new Error('No baseline version was recorded before this comparison');
    }
    // The previous version must still exist as its own Published row — proof the earlier version
    // was preserved rather than edited in place.
    await page.verifyTemplateVersionPublished(name, baseline);
  }
);

When(
  'I delete all versions of {string} template',
  async function (this: CustomWorld, type: string): Promise<void> {
    const name = resolveTemplateName(this, type);
    const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
    await page.deleteAllTemplatesByName(name);
  }
);

Then(
  'I should see {string} template status as {string}',
  async function (this: CustomWorld, type: string, status: string): Promise<void> {
    const name = resolveTemplateName(this, type);
    const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
    await page.verifyTemplateStatus(name, status);
  }
);

/**
 * Edit created template
 */
When(
  'I click edit for {string} template',
  async function (this: CustomWorld, type: string): Promise<void> {
    const name = resolveTemplateName(this, type);
    const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
    await page.editTemplateByName(name);
  }
);

When(
  'I click form builder for {string} template',
  async function (this: CustomWorld, type: string): Promise<void> {
    const name = resolveTemplateName(this, type);
    const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
    await page.openTemplateBuilderByName(name);
  }
);

/**
 * Verify template not exists
 */
Then(
  'I should not see {string} template in the list',
  async function (this: CustomWorld, type: string): Promise<void> {
    const name = resolveTemplateName(this, type);
    const page = new SurveyTemplatesPage(this.page!, this.runtimeData);
    await page.verifyTemplateNotExists(name);
  }
);
