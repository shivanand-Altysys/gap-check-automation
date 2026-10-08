import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { CountryManagementPage } from '../pages/countryManagementPage';

Then('I should see the Country Management page', async function (this: CustomWorld) {
  const countryManagementPage = new CountryManagementPage(this.page!, this.runtimeData);
  await countryManagementPage.verifyCountryManagementPageVisible();
});

When('I click on Add Country button', async function (this: CustomWorld) {
  const countryManagementPage = new CountryManagementPage(this.page!, this.runtimeData);
  await countryManagementPage.clickAddCountry();
});

When(
  'I search for {string} country by title',
  async function (this: CustomWorld, type: string): Promise<void> {
    let title: string | undefined;

    switch (type.toLowerCase()) {
      case 'created':
        title = this.getData('createdCountry')?.title;
        break;

      case 'updated':
        title = this.getData('updatedCountry')?.title;
        break;

      default:
        title = type;
        break;
    }

    if (!title) {
      throw new Error(`Country title missing for type "${type}"`);
    }

    const countryManagementPage = new CountryManagementPage(this.page!, this.runtimeData);
    await countryManagementPage.searchByTitle(title);
  }
);

Then(
  'I should see {string} country in the list',
  async function (this: CustomWorld, type: string): Promise<void> {
    let title: string | undefined;

    switch (type.toLowerCase()) {
      case 'created':
        title = this.getData('createdCountry')?.title;
        break;

      case 'updated':
        title = this.getData('updatedCountry')?.title;
        break;

      default:
        title = type;
        break;
    }

    if (!title) {
      throw new Error(`Country title missing for type "${type}"`);
    }

    const countryManagementPage = new CountryManagementPage(this.page!, this.runtimeData);
    await countryManagementPage.verifyCountryExists(title);
  }
);

Then(
  'I should not see {string} country in the list',
  async function (this: CustomWorld, type: string): Promise<void> {
    let title: string | undefined;

    switch (type.toLowerCase()) {
      case 'created':
        title = this.getData('createdCountry')?.title;
        break;

      case 'updated':
        title = this.getData('updatedCountry')?.title;
        break;

      default:
        title = type;
        break;
    }

    if (!title) {
      throw new Error(`Country title missing for type "${type}"`);
    }

    const countryManagementPage = new CountryManagementPage(this.page!, this.runtimeData);
    await countryManagementPage.verifyCountryNotExists(title);
  }
);

When(
  'I delete {string} country',
  async function (this: CustomWorld, type: string): Promise<void> {
    let title: string | undefined;

    switch (type.toLowerCase()) {
      case 'created':
        title = this.getData('createdCountry')?.title;
        break;
      
      case 'updated':
        title = this.getData('updatedCountry')?.title;
        break;
  

      default:
        title = type;
        break;
    }

    if (!title) {
      throw new Error(`Country title missing for type "${type}"`);
    }

    const countryManagementPage = new CountryManagementPage(this.page!, this.runtimeData);
    await countryManagementPage.deleteCountryByTitle(title);
  }
);

When(
  'I click edit for {string} country',
  async function (this: CustomWorld, type: string): Promise<void> {
    let title: string | undefined;

    switch (type.toLowerCase()) {
      case 'created':
        title = this.getData('createdCountry')?.title;
        break;
      
      case 'updated':
         title = this.getData('updatedCountry')?.title;
         break;  

      default:
        title = type;
        break;
    }

    if (!title) {
      throw new Error(`Country title missing for type "${type}"`);
    }

    const countryManagementPage = new CountryManagementPage(this.page!, this.runtimeData);
    await countryManagementPage.editCountryByTitle(title);
  }
);

Then('I should see the updated title in the country list', async function (this: CustomWorld) {

  const updatedCountry =
    this.getData('updatedCountry');

  if (!updatedCountry?.title) {
    throw new Error(
      'Missing updatedCountry title in runtime data'
    );
  }

  const countryManagementPage =
    new CountryManagementPage(
      this.page!,
      this.runtimeData
    );

  await countryManagementPage.verifyTitleInTable(
    updatedCountry.title
  );
});
