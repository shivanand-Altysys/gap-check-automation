import { faker } from '@faker-js/faker';
import { CountryData, UserData, TemplateData, RoleData, GroupData } from '../types';
import { DefaultUserTemplate } from '../data/userData';
import { DefaultCountryTemplate } from '../data/countryData';
import { DefaultTemplate } from '../data/templateData';
import { DefaultGroupTemplate, DefaultRoleTemplate } from '../data/roleManagementData';

import { getLogger } from '../core/logger';

const logger = getLogger('TestDataGenerator');

export class TestDataGenerator {

  static user(overrides: Partial<UserData> = {}): UserData {
    const user: UserData = {
      email: faker.internet.email().toLowerCase(),
      fullName: this.generateValidFullName(),
      password:
        overrides.password ||
        DefaultUserTemplate.password ||
        this.generateValidPassword(),
      groups: overrides.groups || DefaultUserTemplate.groups,
      ...overrides,
    };

    logger.info('========== GENERATED TEST USER ==========');
    logger.info(`Full Name : ${user.fullName}`);
    logger.info(`Email     : ${user.email}`);
    logger.info(`Password  : ${user.password}`);
    logger.info(`Groups    : ${(user.groups || []).join(', ')}`);
    logger.info('=========================================');

    return user;
  }

  static generateValidFullName(): string {
    const name = faker.person.fullName()
      .replace(/[^A-Za-z\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    logger.info(`Generated Full Name: ${name}`);

    return name;
  }

  static generateValidPassword(): string {
    const upper = faker.string.alpha({ length: 2, casing: 'upper' });
    const lower = faker.string.alpha({ length: 4, casing: 'lower' });
    const numbers = faker.string.numeric(2);
    const special = faker.helpers.arrayElement(['@', '#', '!', '$']);

    const password = faker.helpers
      .shuffle([...upper, ...lower, ...numbers, special])
      .join('') + special;

    logger.info(`Generated Password: ${password}`);

    return password;
  }

  static country(overrides: Partial<CountryData> = {}): CountryData {
    const title = overrides.title || this.generateValidCountryTitle();
    const country: CountryData = {
      title,
      slug: overrides.slug || this.generateSlug(title),
      isoNumericCode:
        overrides.isoNumericCode ||
        DefaultCountryTemplate.isoNumericCode ||
        faker.string.numeric(3),
      administrativeDivisionId:
        overrides.administrativeDivisionId ||
        DefaultCountryTemplate.administrativeDivisionId ||
        `WI-${faker.string.alpha({ length: 3, casing: 'upper' })}`,
      cbaBrowserTitleTemplate:
        overrides.cbaBrowserTitleTemplate ||
        DefaultCountryTemplate.cbaBrowserTitleTemplate ||
        `Collective bargaining agreements in ${title}`,
      cbaBrowserDescriptionTemplate:
        overrides.cbaBrowserDescriptionTemplate ||
        DefaultCountryTemplate.cbaBrowserDescriptionTemplate ||
        `Description shown on the CBA browser landing page for ${title}`,
      ...overrides,
    };

    logger.info('========== GENERATED TEST COUNTRY ==========');
    logger.info(`Title     : ${country.title}`);
    logger.info(`Slug      : ${country.slug}`);
    logger.info(`ISO Code  : ${country.isoNumericCode}`);
    logger.info(`Admin Div : ${country.administrativeDivisionId}`);
    logger.info(`CBA Title Template : ${country.cbaBrowserTitleTemplate}`);
    logger.info(`CBA Desc Template  : ${country.cbaBrowserDescriptionTemplate}`);
    logger.info('============================================');

    return country;
  }

  static template(overrides: Partial<TemplateData> = {}): TemplateData {
    const name = overrides.templateName || `Test Template ${faker.string.alphanumeric({ length: 3, casing: 'upper' })}`;

    const template: TemplateData = {
      templateName: name,
      domain: overrides.domain || DefaultTemplate.domain || '—',
      description: overrides.description || DefaultTemplate.description || `Auto generated template for ${name}`,
      createSection: overrides.createSection ?? DefaultTemplate.createSection ?? false,
      ...overrides,
    };

    logger.info('========== GENERATED TEST TEMPLATE =========');
    logger.info(`Template Name : ${template.templateName}`);
    logger.info(`Domain        : ${template.domain}`);
    logger.info(`CreateSection : ${template.createSection}`);
    logger.info('============================================');

    return template;
  }

  static role(overrides: Partial<RoleData> = {}): RoleData {
    const role: RoleData = {
      name: overrides.name || `Test Role ${faker.string.alphanumeric({ length: 4, casing: 'upper' })}`,
      entity:
        overrides.entity ??
        'CBA Database',
      description:
        overrides.description ||
        DefaultRoleTemplate.description ||
        'Automation role created for role-group coverage',
      ...overrides,
    };

    logger.info('========== GENERATED TEST ROLE =========');
    logger.info(`Role Name   : ${role.name}`);
    logger.info(`Description : ${role.description}`);
    logger.info('========================================');

    return role;
  }

  static group(overrides: Partial<GroupData> = {}): GroupData {
    const group: GroupData = {
      name: overrides.name || `Test Group ${faker.string.alphanumeric({ length: 4, casing: 'upper' })}`,
      roleName: overrides.roleName || '',
      domain: overrides.domain || DefaultGroupTemplate.domain || 'Survey Engine',
      country: overrides.country || DefaultGroupTemplate.country || 'Global',
      ...overrides,
    };

    logger.info('========== GENERATED TEST GROUP =========');
    logger.info(`Group Name : ${group.name}`);
    logger.info(`Role       : ${group.roleName}`);
    logger.info(`Domain     : ${group.domain}`);
    logger.info(`Country    : ${group.country}`);
    logger.info('=========================================');

    return group;
  }

  static generateValidCountryTitle(): string {
    const title = `Test Country ${faker.string.alphanumeric({ length: 3, casing: 'upper' })}`;

    logger.info(`Generated Country Title: ${title}`);

    return title;
  }

  static generateSlug(value: string): string {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    logger.info(`Generated Slug: ${slug}`);

    return slug;
  }
}
