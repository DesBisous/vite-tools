/* eslint-disable jest/no-commented-out-tests */
import assert from 'assert';

function myFirstFunc(str: string) {
  return 'hello ' + str;
}

describe('validate:', () => {
  describe('myFirstFunc', () => {
    test('return hello rollup', () => {
      assert.strictEqual(myFirstFunc('rollup'), 'hello rollup');
    });
  });
});
