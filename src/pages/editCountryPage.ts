import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { EditCountryLocators } from '../locators/editCountryObjects';
import { Actions } from '../utils/actions';
import { CountryData, RuntimeData } from '../types';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { TopBarPage } from './topBarPage';
import { getLogger } from '../core/logger';

const logger = getLogger('edit-country-page');

export class EditCountryPage extends BasePage {
  private locators: EditCountryLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new EditCountryLocators();
  }

  async verifyEditCountryPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(
      this.page,
      this.runtimeData
    );

    await topBarPage.verifyPageTitle('Edit Country');
  }

  async fillTitle(title: string): Promise<void> {
    await Actions.clear(this.page, this.locators.TITLE_INPUT);
    await Actions.type(this.page, this.locators.TITLE_INPUT, title);
  }

  async fillSlug(slug: string): Promise<void> {
    await Actions.clear(this.page, this.locators.SLUG_INPUT);
    await Actions.type(this.page, this.locators.SLUG_INPUT, slug);
  }

  async clickSaveChanges(): Promise<void> {
    await Actions.click(this.page, this.locators.SAVE_CHANGES_BUTTON);
  }

  async updateCountry(): Promise<CountryData> {
    logger.info('Generating updated country data...');
    const title = TestDataGenerator.generateValidCountryTitle();
    const country = TestDataGenerator.country({
      title,
      slug: TestDataGenerator.generateSlug(title),
    });

    await this.fillTitle(country.title);
    await this.fillSlug(country.slug);
    await this.clickSaveChanges();

    return country;
  }
}
