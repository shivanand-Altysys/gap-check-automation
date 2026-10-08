import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { EditTemplatePage } from '../pages/editTemplatePage';

Then('I should see the Edit Template page', async function (this: CustomWorld) {
  const editTemplatePage = new EditTemplatePage(this.page!, this.runtimeData);
  await editTemplatePage.verifyEditTemplatePageVisible();
});

When('I update the template', async function (this: CustomWorld) {
  const editTemplatePage = new EditTemplatePage(this.page!, this.runtimeData);
  const updatedData = await editTemplatePage.updateTemplate();

  const createdTemplate = this.getData('createdTemplate');
  this.setData('createdTemplate', {
    ...createdTemplate,
    ...updatedData
  });
});
