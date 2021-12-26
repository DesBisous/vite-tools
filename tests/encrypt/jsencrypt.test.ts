/**
 * @jest-environment jsdom
 */
import assert from 'assert';
import { encrypt, decrypt } from '../../src/encrypt/jsencrypt';

describe('encrypt:', () => {
  test('test: jsencrypt', () => {
    const content = '一百万';
    const encryptResult = encrypt(content);
    const decryptResult = encryptResult ? decrypt(encryptResult) : encryptResult;
    assert.strictEqual(content, decryptResult);
  });
});
