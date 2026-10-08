import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { BasePage } from '../core/basePage';

Then(
  'I should see message {string}',
  async function (
    this: CustomWorld,
    message: string
  ) {

    const basePage = new BasePage(
      this.page!,
      this.runtimeData
    );

    await basePage.verifyToastBodyMessage(message);
  }
);