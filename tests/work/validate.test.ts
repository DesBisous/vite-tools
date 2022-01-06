/* eslint-disable jest/no-commented-out-tests */
import assert from 'assert';
import { isInvalid, isObject, isNumber } from '../../src/utils/validate';

describe('validate:', () => {
  test('test: isInvalid', () => {
    assert.strictEqual(isInvalid(123), false);
    assert.strictEqual(isInvalid('Test'), false);
    assert.strictEqual(isInvalid(true), false);
    assert.strictEqual(isInvalid(''), true);
    assert.strictEqual(isInvalid(null), true);
    assert.strictEqual(isInvalid(undefined), true);
  });

  test('test: isObject', () => {
    assert.strictEqual(isObject({}), true);
    assert.strictEqual(isObject(123), false);
    assert.strictEqual(isObject(null), false);
  });

  test('test: isNumber', () => {
    assert.strictEqual(isNumber(123), true);
    assert.strictEqual(isNumber('123'), true);
    assert.strictEqual(isNumber('123sss'), false);
    assert.strictEqual(isNumber(null), false);
  });
});
