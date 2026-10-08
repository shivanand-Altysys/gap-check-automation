import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { SurveyTemplatesLocators } from '../locators/surveyTemplateObjects';
import { RuntimeData } from '../types';
import { TopBarPage } from './topBarPage';
import { Actions } from '../utils/actions';
import { getLogger } from '../core/logger';

const logger = getLogger('survey-templates-page');

export class SurveyTemplatesPage extends BasePage {
  private locators: SurveyTemplatesLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new SurveyTemplatesLocators();
  }

  async verifySurveyTemplatesPageVisible(): Promise<void> {
    const topBarPage = new TopBarPage(this.page, this.runtimeData);
    await topBarPage.verifyPageTitle('Survey Engine');
  }

  async getTemplatesCount(): Promise<number> {
    return await this.page.locator(this.locators.TEMPLATES_TABLE_ROWS.value).count();
  }

  async clickAddTemplate(): Promise<void> {
    await Actions.click(this.page, this.locators.ADD_TEMPLATE_BUTTON);
  }

  async searchByTemplateName(name: string): Promise<void> {
    await Actions.type(this.page, this.locators.SEARCH_INPUT, name);
    logger.info(`Searching for template: ${name}`);
  }

  async editTemplateByName(name: string): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.editButtonByTemplateName(name)
    );
    logger.info(`Opened edit for template: ${name}`);
  }

  async openTemplateBuilderByName(name: string): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.builderButtonByTemplateName(name)
    );
    logger.info(`Opened builder for template: ${name}`);
  }

  async verifyTemplateInTable(name: string): Promise<void> {
    const locator = Actions.resolve(
      this.page,
      this.locators.templateRowByName(name)
    );
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    logger.info(`Template found in table: ${name}`);
  }

  async deleteTemplateByName(name: string): Promise<void> {
    await Actions.click(
      this.page,
      this.locators.deleteButtonByTemplateName(name)
    );
    await Actions.click(
      this.page,
      this.locators.CONFIRM_DELETE_BUTTON
    );
    logger.info(`Template deleted: ${name}`);
  }

  /**
   * Reads the published version number (the "Version" column shows "v{N}") for a template row.
   * Returns null when the template has no published version yet (the cell shows a dash).
   */
  async getTemplateVersion(name: string): Promise<number | null> {
    const row = Actions.resolve(this.page, this.locators.templateRowByName(name));
    await row.waitFor({ state: 'visible', timeout: 10000 });
    const rowText = (await row.innerText()).trim();
    const match = rowText.match(/\bv(\d+)\b/i);
    const version = match ? Number(match[1]) : null;
    logger.info(`Template "${name}" published version: ${version ?? '—'}`);
    return version;
  }

  /**
   * Reads every published version number for rows sharing the given name. Publishing a new version
   * keeps the original name, so a template can appear as several rows (one per version).
   */
  async getTemplateVersions(name: string): Promise<number[]> {
    const rows = this.page.locator(this.locators.templateRowByName(name).value);
    const count = await rows.count();
    const versions: number[] = [];
    for (let index = 0; index < count; index += 1) {
      const text = (await rows.nth(index).innerText()).trim();
      const match = text.match(/\bv(\d+)\b/i);
      if (match) versions.push(Number(match[1]));
    }
    logger.info(`Template "${name}" published versions: [${versions.join(', ')}]`);
    return versions;
  }

  async getLatestTemplateVersion(name: string): Promise<number | null> {
    const versions = await this.getTemplateVersions(name);
    return versions.length ? Math.max(...versions) : null;
  }

  /**
   * Waits for the templates table to finish loading (it may still show skeleton rows right after
   * navigating back from the builder) and then polls until the latest published version for the
   * name exceeds `baseline`. Returns that version number.
   */
  async waitForLatestTemplateVersionAbove(name: string, baseline: number): Promise<number> {
    // Ensure the grid has rendered at least one row for the name before reading versions.
    await Actions.resolve(this.page, this.locators.templateRowByName(name))
      .first()
      .waitFor({ state: 'visible', timeout: 15000 });

    let latest: number | null = null;
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      const versions = await this.getTemplateVersions(name);
      latest = versions.length ? Math.max(...versions) : null;
      if (latest !== null && latest > baseline) return latest;
      await this.page.waitForTimeout(300);
    }

    throw new Error(
      `Latest published version of "${name}" (${latest ?? 'none'}) did not exceed the recorded ` +
        `version (v${baseline}) within the timeout`
    );
  }

  /**
   * Verifies a specific (name, version) row exists and is Published — used to assert a previously
   * published version is still present after a newer version is published.
   */
  async verifyTemplateVersionPublished(name: string, version: number): Promise<void> {
    const row = Actions.resolve(this.page, this.locators.templateRowByNameAndVersion(name, version));
    await row.waitFor({ state: 'visible', timeout: 10000 });

    const badge = Actions.resolve(this.page, this.locators.statusBadgeByNameAndVersion(name, version));
    await badge.waitFor({ state: 'visible', timeout: 10000 });
    const status = (await badge.innerText()).trim();
    if (status !== 'Published') {
      throw new Error(`Expected version v${version} of "${name}" to be Published but found "${status}"`);
    }
    logger.info(`Verified version v${version} of "${name}" is still Published`);
  }

  /**
   * Deletes every row sharing the given name (a template can have several version rows). Loops until
   * no matching rows remain.
   */
  async deleteAllTemplatesByName(name: string): Promise<void> {
    const rows = this.page.locator(this.locators.templateRowByName(name).value);
    // Wait for the grid to render the row(s) before counting — avoids a false "nothing to delete".
    await rows.first().waitFor({ state: 'visible', timeout: 15000 });

    let remaining = await rows.count();
    let guard = 0;

    while (remaining > 0 && guard < 10) {
      await this.page
        .locator(this.locators.deleteButtonByTemplateName(name).value)
        .first()
        .click();
      await Actions.click(this.page, this.locators.CONFIRM_DELETE_BUTTON);

      // Wait for the row count to drop before deleting the next one.
      const target = remaining - 1;
      const deadline = Date.now() + 10000;
      while (Date.now() < deadline) {
        if ((await rows.count()) <= target) break;
        await this.page.waitForTimeout(200);
      }

      remaining = await rows.count();
      guard += 1;
    }

    if (remaining > 0) {
      throw new Error(`Failed to delete all "${name}" templates; ${remaining} row(s) remain`);
    }
    logger.info(`Deleted all versions of template: ${name}`);
  }

  async getTemplateStatus(name: string): Promise<string> {
    const locator = Actions.resolve(
      this.page,
      this.locators.statusBadgeByTemplateName(name)
    );

    await locator.waitFor({ state: 'visible', timeout: 10000 });
    const status = (await locator.innerText()).trim();
    logger.info(`Template status for ${name}: ${status}`);
    return status;
  }

  async verifyTemplateStatus(name: string, expectedStatus: string): Promise<void> {
    const actualStatus = await this.getTemplateStatus(name);

    if (actualStatus !== expectedStatus) {
      throw new Error(
        `Expected template "${name}" status to be "${expectedStatus}" but found "${actualStatus}"`
      );
    }

    logger.info(`Template status verified: ${actualStatus} for ${name}`);
  }

  async verifyTemplateNotExists(name: string): Promise<void> {
    const isVisible = await Actions.isVisible(
      this.page,
      this.locators.templateRowByName(name)
    );
    if (isVisible) {
      throw new Error(`Template still exists: ${name}`);
    }
    logger.info(`Template not found: ${name}`);
  }
}
