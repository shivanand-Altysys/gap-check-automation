import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { CountryManagementLocators } from '../locators/countryManagementObjects';
import { Assertions } from '../utils/assertions';
import { RuntimeData } from '../types';
import { Actions } from '../utils/actions';
import { TopBarPage } from './topBarPage';
import { NetworkWait } from '../utils/networkWait';
import { getLogger } from '../core/logger';

const logger = getLogger('country-management-page');

export class CountryManagementPage extends BasePage {
  private locators: CountryManagementLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new CountryManagementLocators();
  }

  async verifyCountryManagementPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(
      this.page,
      this.runtimeData
    );

    await topBarPage.verifyPageTitle('Country Management');
  }

  async clickAddCountry(): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.ADD_COUNTRY_BUTTON
    );
  }

  async searchByTitle(title: string): Promise<void> {
  logger.info(`Searching for country: ${title}`);

  await Actions.type(
    this.page,
    this.locators.SEARCH_TITLE_INPUT,
    title
  );

  await NetworkWait.waitForApiResponseWithQuery(
    this.page,
    '/api/v1/countries/',
    'name',
    8000
  );
}

  async verifyCountryExists(title: string): Promise<void> {
    await Assertions.verifyElementVisible(
      this.page,
      this.locators.countryRowByTitle(title)
    );

    logger.info(`Country found: ${title}`);
  }

  async verifyCountryNotExists(title: string): Promise<void> {
    const isVisible = await Actions.isVisible(
      this.page,
      this.locators.countryRowByTitle(title)
    );

    if (isVisible) {
      throw new Error(`Country still exists: ${title}`);
    }

    logger.info(`Country not found: ${title}`);
  }

  async deleteCountryByTitle(title: string): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.deleteButtonByTitle(title)
    );

    await Actions.click(
      this.page,
      this.locators.CONFIRM_DELETE_BUTTON
    );

    logger.info(`Country deleted: ${title}`);
  }

  async editCountryByTitle(title: string): Promise<void> {

  await Assertions.verifyElementVisible(
    this.page,
    this.locators.countryRowByTitle(title)
  );

  await Actions.click(
    this.page,
    this.locators.editButtonByTitle(title)
  );
}
  async verifyTitleInTable(expectedTitle: string): Promise<void> {
    const locator = Actions.resolve(
      this.page,
      this.locators.countryTitleByTitle(expectedTitle)
    );

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.countryTitleByTitle(expectedTitle)
    );

    const actualTitle = await locator.innerText();

    if (!actualTitle.trim().includes(expectedTitle.trim())) {
      throw new Error(
        `Expected country title "${expectedTitle}" but found "${actualTitle}"`
      );
    }

    logger.info(`Updated country title verified: ${actualTitle}`);
  }
}
