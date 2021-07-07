import assert from 'assert';
import myFirstFunc from '../src';
import { add } from '../src/add';
import { hello } from '../src/hello';

describe('validate:', () => {
  describe('myFirstFunc', () => {
    test('return hello rollup', () => {
      assert.strictEqual(myFirstFunc('rollup'), 'hello rollup');
    });
  });
});

describe('add_validate:', () => {
  /**
   * add
   */
  describe('add', () => {
    test('return 2', () => {
      assert.strictEqual(add(), 2);
    });
  });
});

describe('hello_validate:', () => {
  /**
   * hello
   */
  describe('hello', () => {
    test('return hello rollup', () => {
      assert.strictEqual(hello('rollup'), 'hello rollup');
    });
  });
});
