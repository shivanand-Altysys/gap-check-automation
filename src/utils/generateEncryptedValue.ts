import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { EncryptionUtil } from '../core/encryption';
import { getLogger } from '../core/logger';

const logger = getLogger('encryption-generator');

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});

/**
 * Encryption Generator utility
 * Used to generate encrypted values for config.yml
 * Not used during test execution - only for credential encryption
 */
export class EncryptionGenerator {
  /**
   * Get encryption key from environment variable
   * @returns Base64url-encoded encryption key
   * @throws Error if ENCRYPTION_KEY is not found in .env
   */
  static getKey(): string {
    const key = process.env.ENCRYPTION_KEY;

    if (!key) {
      throw new Error('ENCRYPTION_KEY not found in .env');
    }

    return key;
  }

  /**
   * Encrypt plain text using Fernet algorithm
   * @param text Plain text to encrypt
   * @returns Base64url-encoded Fernet token
   */
  static encrypt(text: string): string {
    const key = this.getKey();

    const keyBuffer = Buffer.from(key, 'base64url');
    const signingKey = keyBuffer.subarray(0, 16);
    const encryptionKey = keyBuffer.subarray(16, 32);

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-128-cbc', encryptionKey, iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    const version = Buffer.from([0x80]);
    const timestamp = Buffer.alloc(8);

    const payload = Buffer.concat([version, timestamp, iv, encrypted]);

    const hmac = crypto.createHmac('sha256', signingKey).update(payload).digest();

    return Buffer.concat([payload, hmac]).toString('base64url');
  }

  /**
   * Test encryption and decryption round-trip
   * @param text Plain text to test
   */
  static test(text: string): void {
    logger.info('Plain Text:');
    logger.info(text);

    const encryptedText = this.encrypt(text);

    logger.info('Encrypted Text:');
    logger.info(encryptedText);

    const decryptedText = EncryptionUtil.decrypt(encryptedText);

    logger.info('Decrypted Text:');
    logger.info(decryptedText);
  }
}

const encrypted = EncryptionGenerator.encrypt("TextToBeEncrypted123!");

logger.info("Encrypted Value:");
logger.info(encrypted);
