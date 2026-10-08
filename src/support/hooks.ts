import fs from 'fs';
import path from 'path';
import {
  BeforeAll,
  AfterAll,
  Before,
  After,
  Status,
  setDefaultTimeout,
  ITestCaseHookParameter,
} from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { getLogger } from '../core/logger';
import { CustomWorld } from './world';
import { RoleManagementPage } from '../pages/roleManagementPage';
import { Sidebar } from '../pages/sideBar';

const logger = getLogger('hooks');
let browser: Browser;
const STEP_TIMEOUT = Number(process.env.STEP_TIMEOUT || '120000');

/**
 * Set default timeout for all steps
 */
setDefaultTimeout(STEP_TIMEOUT);

/**
 * Hook: Before All Scenarios
 * Launch the Chromium browser
 */
BeforeAll(async function (): Promise<void> {
  const headless = (process.env.HEADLESS || 'false').toLowerCase() === 'true';
  const slowMo = Number(process.env.SLOW_MO || '0');
  browser = await chromium.launch({ headless, slowMo });
  logger.info('Browser launched');
});

/**
 * Hook: Before Each Scenario
 * Set up browser context and page for the scenario
 */
Before(async function (this: CustomWorld, { pickle }: ITestCaseHookParameter): Promise<void> {
  logger.info(`Starting scenario: ${pickle.name}`);
  this.runtimeData = {};
  this.browserContext = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  this.page = await this.browserContext.newPage();
  this.page.setDefaultTimeout(STEP_TIMEOUT);
  this.page.setDefaultNavigationTimeout(STEP_TIMEOUT);
});

/**
 * Hook: After Each Scenario
 * Clean up any roles created during the scenario, capture screenshot on
 * failure, then close browser context
 */
After(async function (
  this: CustomWorld,
  { result, pickle }: ITestCaseHookParameter
): Promise<void> {
  // ── Cleanup: delete any roles this scenario created, regardless of pass/fail ──
  if (this.page && !this.page.isClosed()) {
    try {
      const roleNames = this.getCreatedRoles?.() ?? [];
      if (roleNames.length > 0) {
        const sidebar = new Sidebar(this.page, this.runtimeData);
        await sidebar.clickRoleManagement();

        const roleManagementPage = new RoleManagementPage(this.page, this.runtimeData);
        await roleManagementPage.deleteAllTrackedRoles(roleNames);
        logger.info(`Cleanup complete for scenario: ${pickle.name}`);
      }
    } catch (e) {
      logger.info(`Cleanup skipped/failed for scenario "${pickle.name}": ${e}`);
    }
  }

  // ── Screenshot on failure ──
  if (result?.status === Status.FAILED) {
    const reportsDir = path.resolve(__dirname, '..', '..', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const screenshotPath = path.join(
      reportsDir,
      `${pickle.name.replace(/[^a-z0-9]/gi, '_')}.png`
    );
    const screenshot = await this.page!.screenshot({ fullPage: true });
    fs.writeFileSync(screenshotPath, screenshot);
    logger.info(`Screenshot saved: ${screenshotPath}`);
  }

  await this.browserContext?.close();
  logger.info(`Finished scenario: ${pickle.name}`);
});

/**
 * Hook: After All Scenarios
 * Close the browser
 */
AfterAll(async function (): Promise<void> {
  await browser.close();
  logger.info('Browser closed');
});