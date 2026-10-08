import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { EditTemplateLocators } from '../locators/editTemplateObjects';
import { Actions } from '../utils/actions';
import { RuntimeData, TemplateData } from '../types';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { TopBarPage } from './topBarPage';

export class EditTemplatePage extends BasePage {
  private locators: EditTemplateLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new EditTemplateLocators();
  }

  async verifyEditTemplatePageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(this.page, this.runtimeData);
    await topBarPage.verifyPageTitle('Edit Template');
  }

  async fillTemplateName(name: string): Promise<void> {
    await Actions.clear(this.page, this.locators.TEMPLATE_NAME_INPUT);
    await Actions.type(this.page, this.locators.TEMPLATE_NAME_INPUT, name);
  }

  async fillDescription(description: string): Promise<void> {
    await Actions.clear(this.page, this.locators.DESCRIPTION_TEXTAREA);
    await Actions.type(this.page, this.locators.DESCRIPTION_TEXTAREA, description);
  }

  async selectDomain(domain?: string): Promise<void> {
    await Actions.click(this.page, this.locators.DOMAIN_DROPDOWN);
    if (domain) {
      await this.page.click(`text="${domain}"`);
    }
  }

  async clickSaveChanges(): Promise<void> {
    await Actions.click(this.page, this.locators.SAVE_CHANGES_BUTTON);
  }

  async updateTemplate(): Promise<Partial<TemplateData>> {
    const updatedName = `Test Template ${TestDataGenerator.generateSlug(new Date().toISOString())}`;
    const updatedDescription = `Updated: ${new Date().toLocaleString()}`;

    await this.fillTemplateName(updatedName);
    await this.fillDescription(updatedDescription);
    await this.clickSaveChanges();

    return {
      templateName: updatedName,
      description: updatedDescription
    };
  }
}
