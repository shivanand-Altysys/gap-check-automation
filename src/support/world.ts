import { setWorldConstructor } from '@cucumber/cucumber';
import { Page, BrowserContext } from 'playwright';
import { ICustomWorld, RuntimeData, LoginConfig } from '../types';
import { LoginPage } from '../pages/loginPage';

/**
 * Custom Cucumber World
 * Extends Cucumber's world to provide shared test context
 * Includes page instances, browser context, and runtime data
 */
class CustomWorld implements ICustomWorld {
  runtimeData: RuntimeData = {};
  page!: Page;
  browserContext!: BrowserContext;
  loginPage?: LoginPage;
  loginConfig?: LoginConfig;

  /**
   * Store data in runtime data store
   * @param key Data key
   * @param value Data value
   */
  setData(key: string, value: any): void {
    this.runtimeData[key] = value;
  }

  /**
   * Retrieve data from runtime data store
   * @param key Data key
   * @returns Data value or undefined
   */
  getData(key: string): any {
    return this.runtimeData[key];
  }

  trackCreatedRole(roleName: string) {
    const existing = (this.getData('createdRoleNames') as string[]) || [];
    existing.push(roleName);
    this.setData('createdRoleNames', existing);
  }

  getCreatedRoles(): string[] {
    return (this.getData('createdRoleNames') as string[]) || [];
  }
}

/**
 * Register CustomWorld with Cucumber
 * This ensures CustomWorld instance is created for each scenario
 */
setWorldConstructor(CustomWorld);

export { CustomWorld };
