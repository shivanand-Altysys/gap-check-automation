import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { CreateTemplatePage } from '../pages/createTemplatePage';
import { TestDataGenerator } from '../utils/testDataGenerator';

Then('I should see the Create Template page', async function (this: CustomWorld) {
  const page = new CreateTemplatePage(this.page!, this.runtimeData);
  await page.verifyCreateTemplatePageVisible();
});

When('I fill the template name in Create Template form', async function (this: CustomWorld) {
  const page = new CreateTemplatePage(this.page!, this.runtimeData);
  const template = this.getData('createdTemplate') || TestDataGenerator.template();
  this.setData('createdTemplate', template);
  await page.fillTemplateName(template.templateName);
});

When('I select {string} as domain in Create Template form', async function (this: CustomWorld, domain: string) {
  const page = new CreateTemplatePage(this.page!, this.runtimeData);
  await page.selectDomain(domain);
});

When('I fill the description in Create Template form', async function (this: CustomWorld) {
  const page = new CreateTemplatePage(this.page!, this.runtimeData);
  const template = this.getData('createdTemplate') || TestDataGenerator.template();
  this.setData('createdTemplate', template);
  await page.fillDescription(template.description);
});

When('I choose to {string} create a section', async function (this: CustomWorld, choice: string) {
  const page = new CreateTemplatePage(this.page!, this.runtimeData);
  const create = choice.toLowerCase() === 'yes';
  await page.toggleCreateSection(create);
});

When('I click Proceed on Create Template', async function (this: CustomWorld) {
  const page = new CreateTemplatePage(this.page!, this.runtimeData);
  await page.clickProceed();
});

When('I create a new survey template', async function (this: CustomWorld) {
  const page = new CreateTemplatePage(this.page!, this.runtimeData);
  const template = await page.createTemplate();
  this.setData('createdTemplate', template);
});

Then('I should see the create template validation messages', async function (this: CustomWorld, dataTable) {
  const page = new CreateTemplatePage(this.page!, this.runtimeData);
  const messages = dataTable.raw().flat();
  await page.verifyValidationMessages(messages);
});
