import { Page } from 'playwright';
import { BasePage } from '../core/basePage';
import { AuditLogLocators } from '../locators/auditLogObjects';
import { Actions } from '../utils/actions';
import { Assertions } from '../utils/assertions';
import { RuntimeData } from '../types';
import { getLogger } from '../core/logger';

const logger = getLogger('audit-log-page');

export class AuditLogPage extends BasePage {
  private locators: AuditLogLocators;

  constructor(page: Page, runtimeData: RuntimeData) {
    super(page, runtimeData);
    this.locators = new AuditLogLocators();
  }

  async verifyAuditLogPageVisible(): Promise<void> {
    logger.info('Verifying Audit Log page is visible');

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.AUDIT_LOG_CARD
    );

    logger.info('Audit Log page verified as visible');
  }

  async verifyAuditLogEntryByAction(action: string): Promise<void> {
    await this.waitForTableToLoad();

    const rows = this.page.locator(
      'tbody tr:visible'
    );
    const rowCount = await rows.count();

    logger.info(`Total rows found: ${rowCount}`);

    for (let i = 0; i < rowCount; i++) {
      const text = await rows.nth(i).innerText();

      if (text.toUpperCase().includes(action.toUpperCase())) {
        logger.info(`${action} entry found`);
        return;
      }
    }

    throw new Error(`${action} entry not found`);
  }

  async getTableRowCount(): Promise<number> {
  logger.info('Getting table row count');

  const rows = await this.page
    .locator(`${this.locators.TABLE_ROWS.value}:visible`)
    .count();

  logger.info(`Table has ${rows} rows`);

  return rows;
}
  async selectActionFilter(filterOption: string): Promise<void> {
    logger.info(`Selecting action filter: ${filterOption}`);

    const optionMap: Record<string, string> = {
      INSERT: 'Insert',
      UPDATE: 'Update',
      DELETE: 'Delete'
    };

    const displayValue =
      optionMap[filterOption] || filterOption;

    await Actions.click(
      this.page,
      this.locators.ACTION_FILTER_BUTTON
    );

    await Actions.click(
      this.page,
      this.locators.FILTER_OPTION(displayValue)
    );

    await this.waitForTableToLoad();

    logger.info(`Filter selected: ${displayValue}`);
  }

  async openFirstAuditDetails(): Promise<void> {
    logger.info('Opening first audit entry details');

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.FIRST_VIEW_BUTTON
    );

    await Actions.click(
      this.page,
      this.locators.FIRST_VIEW_BUTTON
    );

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.DETAILS_MODAL
    );

    logger.info('Details modal opened');
  }

  async openAuditDetailsByRow(rowIndex: number): Promise<void> {
    logger.info(
      `Opening audit entry details for row ${rowIndex}`
    );

    const viewButton =
      this.locators.VIEW_BUTTON_BY_ROW(rowIndex);

    await Assertions.verifyElementVisible(
      this.page,
      viewButton
    );

    await Actions.click(
      this.page,
      viewButton
    );

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.DETAILS_MODAL
    );

    logger.info(`Details opened for row ${rowIndex}`);
  }

  async verifyDetailsModalVisible(): Promise<void> {
    logger.info('Verifying details modal is visible');

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.DETAILS_MODAL
    );

    logger.info('Details modal is visible');
  }

  async verifyOldValueColumnVisible(): Promise<void> {
    logger.info('Verifying old value column');

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.OLD_VALUE_COLUMN
    );
  }

  async verifyNewValueColumnVisible(): Promise<void> {
    logger.info('Verifying new value column');

    await Assertions.verifyElementVisible(
      this.page,
      this.locators.NEW_VALUE_COLUMN
    );
  }

  async setRecordsPerPage(
  pageSize: number
): Promise<void> {

  await this.page.selectOption(
    this.locators.PAGE_SIZE_SELECTOR.value,
    pageSize.toString()
  );

  await this.page.waitForLoadState(
    'networkidle'
  );

  const rows = this.page.locator(
    this.locators.TABLE_ROWS.value
  );

  await rows.first().waitFor({
    state: 'visible'
  });

  const selectedValue =
    await this.page
      .locator(
        this.locators.PAGE_SIZE_SELECTOR.value
      )
      .inputValue();

  logger.info(
    `Selected page size: ${selectedValue}`
  );

  const rowCount =
    await this.getTableRowCount();

  logger.info(
    `Rows after page size change: ${rowCount}`
  );
}

  async verifyCountryAuditLogEntry(
  action: string
): Promise<void> {

  for (let attempt = 1; attempt <= 5; attempt++) {

    await this.page.reload();
    await this.waitForTableToLoad();

    const rows = this.page.locator(
      `${this.locators.TABLE_ROWS.value}:visible`
    );

    const count = await rows.count();

    logger.info(
      `Attempt ${attempt} - searching for ${action}`
    );

    for (let i = 0; i < count; i++) {

      const text = await rows.nth(i).innerText();

      logger.info(`Row ${i + 1}: ${text}`);

      if (
        text.includes('Countries') &&
        text.toUpperCase().includes(
          action.toUpperCase()
        )
      ) {
        logger.info(
          `${action} country audit entry found`
        );
        return;
      }
    }

    
  }

  throw new Error(
    `Country audit log entry not found for action ${action}`
  );
}

  async waitForTableToLoad(): Promise<void> {

  logger.info('Waiting for audit log table');

  await this.page.waitForLoadState('networkidle');

  const rows = this.page.locator(
    this.locators.TABLE_ROWS.value
  );

  await rows.first().waitFor({
    state: 'visible'
  });

  const rowCount = await rows.count();

  if (rowCount === 0) {
    throw new Error(
      'Audit log table data not loaded'
    );
  }

  logger.info(
    `Audit log table loaded with ${rowCount} rows`
  );
}

  async openUpdateAuditDetails(): Promise<void> {

  for (let attempt = 1; attempt <= 5; attempt++) {

    await this.page.reload();
    await this.waitForTableToLoad();

    const rows = this.page.locator(
      `${this.locators.TABLE_ROWS.value}:visible`
    );
    const count = await rows.count();

    logger.info(`Rows found: ${count}`);

    for (let i = 0; i < count; i++) {

      const text = await rows.nth(i).innerText();

      logger.info(`Row ${i + 1}: ${text}`);

      if (
        text.includes('Countries') &&
        text.toUpperCase().includes('UPDATE')
      ) {
        logger.info(
          `UPDATE row found at ${i + 1}`
        );

        await this.openAuditDetailsByRow(i + 1);
        return;
      }
    }

    
  }

  throw new Error(
    'UPDATE audit entry not found'
  );
}

async verifyOldValueExists(): Promise<void> {
  await Assertions.verifyElementVisible(
    this.page,
    this.locators.OLD_VALUE_COLUMN
  );

  const value =
    await this.page
      .locator(this.locators.OLD_VALUE_CELL.value)
      .first()
      .innerText();

  if (!value.trim()) {
    throw new Error('Old value is empty');
  }
}

async verifyNewValueExists(): Promise<void> {
  await Assertions.verifyElementVisible(
    this.page,
    this.locators.NEW_VALUE_COLUMN
  );

  const value =
    await this.page
      .locator(this.locators.NEW_VALUE_CELL.value)
      .first()
      .innerText();

  if (!value.trim()) {
    throw new Error('New value is empty');
  }
}


  async verifyFilteredResults(
  action: string
): Promise<void> {

  await this.waitForTableToLoad();

  const rows = this.page.locator(
    `${this.locators.TABLE_ROWS.value}:visible`
  );

  const count = await rows.count();

  for (let i = 0; i < count; i++) {

    const text =
      await rows.nth(i).innerText();

    if (
      !text.toUpperCase().includes(
        action.toUpperCase()
      )
    ) {
      throw new Error(
        `Row ${i + 1} does not match filter ${action}`
      );
    }
  }

  logger.info(
    `All ${count} rows match ${action} filter`
  );
}


  async verifyCountryUpdateValues(
  oldTitle: string,
  newTitle: string
): Promise<void> {

  const modalText =
    await this.page
      .locator(this.locators.DETAILS_MODAL.value)
      .innerText();

  if (!modalText.includes(oldTitle)) {
    throw new Error(
      `Old value not found: ${oldTitle}`
    );
  }

  if (!modalText.includes(newTitle)) {
    throw new Error(
      `New value not found: ${newTitle}`
    );
  }

  logger.info(
    `Verified audit values successfully. Old="${oldTitle}", New="${newTitle}"`
  );
}

}