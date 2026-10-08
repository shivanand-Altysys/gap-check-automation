import { Page, BrowserContext } from 'playwright';

/**
 * Locator Strategy Types
 */
export const LocatorStrategy = {
  CSS: 'css',
  ROLE: 'role',
  XPATH: 'xpath',
  TEXT: 'text',
  NTH: 'nth',
} as const;

export type LocatorStrategyType = typeof LocatorStrategy[keyof typeof LocatorStrategy];

/**
 * Base Locator interface with common properties
 */
interface BaseLocator {
  value: string;
  exact?: boolean;
}

/**
 * CSS Locator Strategy
 */
export interface CSSLocator extends BaseLocator {
  strategy: 'css';
}

/**
 * Role Locator Strategy (Playwright getByRole)
 */
export interface RoleLocator extends BaseLocator {
  strategy: 'role';
  role: string;
}

/**
 * Text Locator Strategy (Playwright getByText)
 */
export interface TextLocator extends BaseLocator {
  strategy: 'text';
}

/**
 * XPath Locator Strategy
 */
export interface XPathLocator extends BaseLocator {
  strategy: 'xpath';
}

//NTH Locator Strategy
export interface NthLocator extends BaseLocator {
  strategy: 'nth';
  index: number;
}

/**
 * Union type for all locator types
 */
export type Locator = CSSLocator | RoleLocator | TextLocator | XPathLocator | NthLocator;

/**
 * Logger Interface
 */
export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

/**
 * Credentials Interface
 */
export interface Credentials {
  username?: string;
  email?: string;
  password: string;
}

export interface UserData {
  email: string;
  fullName: string;
  password: string;
  groups?: string[];
}

export interface RoleData {
  name: string;
  entity: string;
  description: string;
}

export interface GroupData {
  name: string;
  roleName: string;
  domain: string;
  country: string;
}

export interface CountryData {
  title: string;
  slug: string;
  isoNumericCode?: string;
  administrativeDivisionId?: string;
  cbaBrowserTitleTemplate?: string;
  cbaBrowserDescriptionTemplate?: string;
}

export interface TemplateData {
  templateName: string;
  domain?: string;
  description?: string;
  createSection?: boolean;
  version?: string;
}

export interface TemplateBuilderQuestionData {
  typeLabel: string;
  question: string;
  options?: string[];
  required?: boolean; 
  comment?: boolean;
  previewAnswer?: string | string[];
  helpText?: string;
  // Manually-entered question key (overrides the label-derived default). Used to exercise
  // question-key uniqueness validation.
  sourceListName?: string;
  searchKeyword?: string;
  questionKey?: string;
  visibleWhen?: {
    sourceQuestion: string;
    value: string | string[];
    operator?: string;
  };
  requiredWhen?: {
    sourceQuestion: string;
    value: string | string[];
    operator?: string;
  };
}

export interface TemplateBuilderData {
  sectionName: string;
  sections: {
    name: string;
    questions: TemplateBuilderQuestionData[];
  }[];
}

/**
 * Login Config Interface - Matches config.yml structure
 */
export interface LoginConfig {
  base_url: string;
  Admin: Credentials;
  Data_Manager?: Credentials;
  Annotator?: Credentials;
  Reviewer?: Credentials;
  [key: string]: Credentials | string | undefined;
}

/**
 * Runtime Data Type - Flexible key-value store for test context
 */
export type RuntimeData = Record<string, any>;

/**
 * Custom World Interface for Cucumber
 */
export interface ICustomWorld {
  runtimeData: RuntimeData;
  page?: Page;
  browserContext?: BrowserContext;
  loginPage?: any;
  loginConfig?: LoginConfig;

  setData(key: string, value: any): void;
  getData(key: string): any;
}

/**
 * Actions Options Interface
 */
export interface ActionsOptions {
  timeout?: number;
}

/**
 * Assertion Options Interface
 */
export interface AssertionOptions {
  timeout?: number;
}

/**
 * Retry Options Interface
 */
export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
}
