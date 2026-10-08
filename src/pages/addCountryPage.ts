import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { AddCountryLocators } from '../locators/addCountryObjects';
import { Actions } from '../utils/actions';
import { CountryData, RuntimeData } from '../types';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { TopBarPage } from './topBarPage';
import { Assertions } from '../utils/assertions';
import { InvalidCountryData } from '../data/countryData';

export class AddCountryPage extends BasePage {
  private locators: AddCountryLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new AddCountryLocators();
  }

  async verifyAddCountryPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(
      this.page,
      this.runtimeData
    );

    await topBarPage.verifyPageTitle('Add Country');
  }

  async fillTitle(title: string): Promise<void> {
    await Actions.type(this.page, this.locators.TITLE_INPUT, title);
  }

  async fillSlug(slug: string): Promise<void> {
    await Actions.type(this.page, this.locators.SLUG_INPUT, slug);
  }

  async fillIsoNumericCode(isoNumericCode?: string): Promise<void> {
    await Actions.type(this.page, this.locators.ISO_NUMERIC_CODE_INPUT, isoNumericCode ?? '');
  }

  async fillAdministrativeDivisionId(administrativeDivisionId?: string): Promise<void> {
    await Actions.type(
      this.page,
      this.locators.ADMINISTRATIVE_DIVISION_ID_INPUT,
      administrativeDivisionId ?? ''
    );
  }

  async fillCbaBrowserTitleTemplate(template?: string): Promise<void> {
    await Actions.type(
      this.page,
      this.locators.CBA_BROWSER_TITLE_TEMPLATE_INPUT,
      template ?? ''
    );
  }

  async fillCbaBrowserDescriptionTemplate(template?: string): Promise<void> {
    await Actions.type(
      this.page,
      this.locators.CBA_BROWSER_DESCRIPTION_TEMPLATE_INPUT,
      template ?? ''
    );
  }

  async clickSaveCountry(): Promise<void> {
    await Actions.click(this.page, this.locators.SAVE_COUNTRY_BUTTON);
  }

  async fillCountryForm(country: CountryData): Promise<void> {
    await this.fillTitle(country.title);
    await this.fillSlug(country.slug);
    await this.fillIsoNumericCode(country.isoNumericCode);
    await this.fillAdministrativeDivisionId(country.administrativeDivisionId);
    await this.fillCbaBrowserTitleTemplate(country.cbaBrowserTitleTemplate);
    await this.fillCbaBrowserDescriptionTemplate(country.cbaBrowserDescriptionTemplate);
  }

  async createCountry(overrides: Partial<CountryData> = {}): Promise<CountryData> {
    const country = TestDataGenerator.country(overrides);

    await this.fillCountryForm(country);
    await this.clickSaveCountry();

    return country;
  }

  async verifyValidationMessages(expectedMessages: string[]): Promise<void> {
    await Assertions.verifyTexts(
      this.page,
      this.locators.VALIDATION_MESSAGES,
      expectedMessages
    );
  }

  async fillInvalidCountryData(): Promise<void> {
  await this.fillTitle(InvalidCountryData.title!);
  await this.fillSlug(InvalidCountryData.slug!);
  await this.fillIsoNumericCode(InvalidCountryData.isoNumericCode!);
  await this.fillAdministrativeDivisionId(
    InvalidCountryData.administrativeDivisionId!
  );
  }

}
