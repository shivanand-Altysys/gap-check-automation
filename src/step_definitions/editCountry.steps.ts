import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { EditCountryPage } from '../pages/editCountryPage';

Then('I should see the Edit Country page', async function (this: CustomWorld) {
  const editCountryPage = new EditCountryPage(this.page!, this.runtimeData);
  await editCountryPage.verifyEditCountryPageVisible();
});

When('I update the country', async function (this: CustomWorld) {

  const editCountryPage = new EditCountryPage(
    this.page!,
    this.runtimeData
  );

  const updatedCountry =
    await editCountryPage.updateCountry();

  this.setData(
    'updatedCountry',
    updatedCountry
  );
});

