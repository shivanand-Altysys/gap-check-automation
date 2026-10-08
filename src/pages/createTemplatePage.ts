import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { CreateTemplateLocators } from '../locators/createTemplateObjects';
import { Actions } from '../utils/actions';
import { RuntimeData, TemplateData } from '../types';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { TopBarPage } from './topBarPage';
import { Assertions } from '../utils/assertions';
import { getLogger } from '../core/logger';

const logger = getLogger('create-template-page');

export class CreateTemplatePage extends BasePage {
  private locators: CreateTemplateLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new CreateTemplateLocators();
  }

  async verifyCreateTemplatePageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(this.page, this.runtimeData);
    await topBarPage.verifyPageTitle('Create Template');
  }

  async fillTemplateName(name: string): Promise<void> {
    await Actions.type(this.page, this.locators.TEMPLATE_NAME_INPUT, name);
  }

  async selectDomain(domain?: string): Promise<void> {
    if (!domain) return;

    await Actions.click(
      this.page,
      this.locators.DOMAIN_DROPDOWN
    );

    await this.page.waitForSelector(
      'div[role="listbox"]',
      { state: 'visible', timeout: 10000 }
    );

    await Actions.click(
      this.page,
      this.locators.domainOption(domain)
    );

    logger.info(`Domain selected: ${domain}`);
  }

  async fillDescription(description?: string): Promise<void> {
    await Actions.type(this.page, this.locators.DESCRIPTION_TEXTAREA, description ?? '');
  }

  async toggleCreateSection(create: boolean): Promise<void> {
    if (create) {
      await Actions.click(this.page, this.locators.CREATE_SECTION_YES);
    } else {
      await Actions.click(this.page, this.locators.CREATE_SECTION_NO);
    }
  }

  async clickProceed(): Promise<void> {
    await Actions.click(this.page, this.locators.PROCEED_BUTTON);
  }

  async fillSectionName(sectionName: string): Promise<void> {
    await Actions.type(this.page, this.locators.SECTION_NAME_INPUT, sectionName);
  }

  async clickSaveSection(): Promise<void> {
    await Actions.click(this.page, this.locators.SAVE_SECTION_BUTTON);
  }

  async fillTemplateForm(template: TemplateData): Promise<void> {
    await this.fillTemplateName(template.templateName);
    await this.selectDomain(template.domain);
    await this.fillDescription(template.description);
    await this.toggleCreateSection(!!template.createSection);
  }

  async createTemplate(overrides: Partial<TemplateData> = {}): Promise<TemplateData> {
    const template = TestDataGenerator.template(overrides);

    await this.fillTemplateForm(template);
    await this.clickProceed();

    return template;
  }

  async verifyValidationMessages(expectedMessages: string[]): Promise<void> {
    await Assertions.verifyTexts(this.page, this.locators.VALIDATION_MESSAGES, expectedMessages);
  }
}
