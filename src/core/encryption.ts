import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

/**
 * Encryption Utility for Fernet token decryption
 * Handles Python-compatible Fernet encryption (AES-128-CBC with HMAC-SHA256)
 */
export class EncryptionUtil {
  /**
   * Decrypt a Fernet-encrypted value
   * If value doesn't start with "gAAAA", returns it as-is (plaintext)
   * @param value Encrypted or plaintext value
   * @returns Decrypted plaintext value
   * @throws Error if ENCRYPTION_KEY is missing or token is invalid
   */
  static decrypt(value: string): string {
    if (!value || !value.startsWith('gAAAA')) {
      return value;
    }

    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error(
        'ENCRYPTION_KEY not found. Provide it in the .env file to decrypt credentials.'
      );
    }

    return this.decryptFernet(value, key);
  }

  /**
   * Decrypt a Fernet token using the provided key
   * @param token Base64url-encoded Fernet token
   * @param key Base64url-encoded encryption key
   * @returns Decrypted plaintext string
   * @throws Error if token version is unsupported or signature is invalid
   */
  private static decryptFernet(token: string, key: string): string {
    const signingKey = Buffer.from(key, 'base64url').subarray(0, 16);
    const encryptionKey = Buffer.from(key, 'base64url').subarray(16, 32);
    const data = Buffer.from(token, 'base64url');

    if (data[0] !== 0x80) {
      throw new Error('Unsupported Fernet token version.');
    }

    // Verify HMAC signature
    const hmacStart = data.length - 32;
    const payload = data.subarray(0, hmacStart);
    const providedHmac = data.subarray(hmacStart);
    const computedHmac = crypto.createHmac('sha256', signingKey).update(payload).digest();

    if (!crypto.timingSafeEqual(providedHmac, computedHmac)) {
      throw new Error('Invalid Fernet token signature.');
    }

    // Decrypt AES-128-CBC
    const iv = data.subarray(9, 25);
    const ciphertext = data.subarray(25, hmacStart);
    const decipher = crypto.createDecipheriv('aes-128-cbc', encryptionKey, iv);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    return decrypted.toString('utf8');
  }
}
