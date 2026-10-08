import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import { EncryptionUtil } from '../core/encryption';
import { getLogger } from '../core/logger';
import { Credentials, LoginConfig } from '../types';

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});

const logger = getLogger('config-reader');

/**
 * Sections that can contain encrypted credentials
 */
const DECRYPT_SECTIONS = ['Admin', 'Data_Manager', 'Annotator', 'Reviewer'];

/**
 * Fields that should be automatically decrypted
 */
const SENSITIVE_FIELDS = ['username', 'password', 'email'];

/**
 * Configuration Reader utility
 * Handles loading config from YAML and automatic decryption of credentials
 */
export class ConfigReader {
  /**
   * Check if value is encrypted and decrypt if needed
   * @param value Value to check and decrypt
   * @returns Decrypted or original value
   */
  private static maybeDecrypt(value: any): any {
    if (typeof value === 'string' && value.startsWith('gAAAA')) {
      return EncryptionUtil.decrypt(value);
    }
    return value;
  }

  /**
   * Load login configuration from config.yml
   * Automatically decrypts encrypted credentials
   * @returns Parsed and decrypted login configuration
   * @throws Error if config file is not found
   */
  static getLoginConfig(): LoginConfig {
    const configPath = path.resolve(__dirname, '..', '..', 'config', 'config.yml');
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }

    const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as LoginConfig;

    // Decrypt all whitelisted sections
    for (const section of DECRYPT_SECTIONS) {
      if (!(section in config)) continue;

      const sectionData = config[section] as Credentials;
      for (const field of SENSITIVE_FIELDS) {
        if (field in sectionData) {
          (sectionData as any)[field] = this.maybeDecrypt((sectionData as any)[field]);
        }
      }
    }

    logger.info('Login config loaded successfully');
    return config;
  }

  /**
   * Get credentials by role name
   * Handles any case/space variations (e.g., "Admin" or "admin" or "ADMIN")
   * @param role Role name to retrieve credentials for
   * @returns Credentials object with username and password
   * @throws Error if role is not found in config
   */
  static getCredentialsForRole(role: string): Credentials {
    const config = this.getLoginConfig();

    // Find matching key regardless of case/spaces
    const matchedKey = Object.keys(config).find(
      (key) =>
        key.toLowerCase().replace(/\s+/g, '_') === role.toLowerCase().replace(/\s+/g, '_')
    );

    if (!matchedKey) {
      throw new Error(
        `Role "${role}" not found in config.yml. Available roles: ${Object.keys(config).join(', ')}`
      );
    }

    const section = config[matchedKey] as Credentials;
    return {
      username: section.username || section.email,
      password: section.password,
    };
  }
}
