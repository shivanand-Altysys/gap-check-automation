import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { AddCountryPage } from '../pages/addCountryPage';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { ExistingCountryData } from '../data/countryData';

Then('I should see the Add Country page', async function (this: CustomWorld) {
  const addCountryPage = new AddCountryPage(this.page!, this.runtimeData);
  await addCountryPage.verifyAddCountryPageVisible();
});

When('I fill the title in Add Country form', async function (this: CustomWorld) {
  const addCountryPage = new AddCountryPage(this.page!, this.runtimeData);
  const country = this.getData('createdCountry') || TestDataGenerator.country();

  this.setData('createdCountry', country);

  await addCountryPage.fillTitle(country.title);
});

When('I fill the slug in Add Country form', async function (this: CustomWorld) {
  const addCountryPage = new AddCountryPage(this.page!, this.runtimeData);
  const country = this.getData('createdCountry') || TestDataGenerator.country();

  this.setData('createdCountry', country);

  await addCountryPage.fillSlug(country.slug);
});

When('I click Save Country button', async function (this: CustomWorld) {
  const addCountryPage = new AddCountryPage(this.page!, this.runtimeData);
  await addCountryPage.clickSaveCountry();
});

When('I create a new country', async function (this: CustomWorld) {
  const addCountryPage = new AddCountryPage(this.page!, this.runtimeData);
  const country = await addCountryPage.createCountry();

  this.setData('createdCountry', country);
});

Then(
  'I should see the add country validation messages',
  async function (this: CustomWorld, dataTable) {
    const addCountryPage = new AddCountryPage(this.page!, this.runtimeData);
    const messages = dataTable.raw().flat();

    await addCountryPage.verifyValidationMessages(messages);
  }
);

When(
  'I fill the country form with existing country',
  async function (this: CustomWorld) {
    const addCountryPage = new AddCountryPage(
      this.page,
      this.runtimeData
    );

    // Use static existing country data
    await addCountryPage.fillTitle(ExistingCountryData.title!);
    await addCountryPage.fillSlug(ExistingCountryData.slug!);
  }
);

When(
  'I fill the country form with invalid country data',
  async function (this: CustomWorld) {
    const addCountryPage = new AddCountryPage(
      this.page!,
      this.runtimeData
    );

    await addCountryPage.fillInvalidCountryData();
  }
);