import { LocatorStrategy } from '../core/locatorStrategy';
import { CSSLocator } from '../types';

export class AuditLogLocators {

  // Page
  readonly AUDIT_LOG_CARD: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.audit-log-card',
  };

  // Filters
  readonly ACTION_FILTER_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button[class*="filter"], button:has-text("All actions")',
  };

  readonly FILTER_OPTION = (option: string): CSSLocator => ({
    strategy: LocatorStrategy.CSS,
    value: `[role="option"]:has-text("${option}")`,
  });

  // Table
  readonly TABLE: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'table',
  };

  readonly TABLE_ROWS: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'tbody tr',
  };

  // Details
  readonly FIRST_VIEW_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'tbody tr:first-child button.btn-link:has-text("View")',
  };

  readonly VIEW_BUTTON_BY_ROW = (rowIndex: number): CSSLocator => ({
    strategy: LocatorStrategy.CSS,
    value: `tbody tr:nth-child(${rowIndex}) button.btn-link:has-text("View")`,
  });

  // Pagination
  readonly PAGE_SIZE_SELECTOR: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'select[aria-label="Rows per page"]',
  };

  readonly NEXT_PAGE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button[aria-label="Next page"]',
  };

  readonly PREVIOUS_PAGE_BUTTON: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: 'button[aria-label="Previous page"]',
  };

  // Modal
  readonly DETAILS_MODAL: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '[role="dialog"], .modal.show',
  };

  readonly OLD_VALUE_COLUMN: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.audit-detail__table th:has-text("Old Value")',
  };

  readonly NEW_VALUE_COLUMN: CSSLocator = {
    strategy: LocatorStrategy.CSS,
    value: '.audit-detail__table th:has-text("New Value")',
  };

  readonly OLD_VALUE_CELL: CSSLocator = {
  strategy: LocatorStrategy.CSS,
  value: '.audit-detail__table tbody td:nth-child(2)'
  };

  readonly NEW_VALUE_CELL: CSSLocator = {
  strategy: LocatorStrategy.CSS,
  value: '.audit-detail__table tbody td:nth-child(3)'
  };
}