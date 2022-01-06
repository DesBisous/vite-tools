import { Decimal } from 'decimal.js';
import { isInvalid } from './validate';

/**
 * 旧: 四舍五入
 * @param {number | string} value 值
 * @param {number | string} num 位数 默认两位
 * @returns
 */
export function bitSept(value: number, num: number | string = 2): string | number {
  if (isNaN(value) || isInvalid(value)) {
    return '0.00';
  }
  if (typeof num === 'string') {
    return value;
  }
  const numStr = `${value}`;

  let floatValue = parseFloat(numStr);
  const powNum = Math.pow(10, num);
  const tempNumber = floatValue * powNum;
  floatValue = Math.round(tempNumber) / powNum;
  const _str = (floatValue + '').split('.');

  if (_str.length === 1) {
    if (!/\./.test(_str[0])) {
      const _numInt = _str[0] + '.';
      return _numInt.padEnd(_numInt.length + num, '0');
    }
    return _str[0];
  }
  return `${_str[0]}.${_str[1].padEnd(num, '0')}`;
}

/**
 * 新: 四舍五入
 * @param {number} value 值
 * @param {number} num 位数 默认两位
 * @returns
 */
export function mathToFixed(a: number, num = 2): string {
  return new Decimal(a).toFixed(num);
}

export function mathToNumber(a: Decimal): number {
  return a.toNumber();
}

/**
 * 加法
 */
export function mathAdd(a: number, ...arr: number[]): number {
  return mathToNumber(
    arr.reduce((pre: any, item) => {
      return pre.add(new Decimal(item));
    }, new Decimal(a))
  );
}

/**
 * 减法
 */
export function mathSubStract(a: number, ...arr: number[]): number {
  return mathToNumber(
    arr.reduce((pre: any, item) => {
      return pre.sub(new Decimal(item));
    }, new Decimal(a))
  );
}

/**
 * 乘法
 */
export function mathMultiply(a: number, ...arr: number[]): number {
  return mathToNumber(
    arr.reduce((pre: any, item) => {
      return pre.mul(new Decimal(item));
    }, new Decimal(a))
  );
}

/**
 * 除法
 */
export function mathDivide(a: number, ...arr: number[]): number {
  return mathToNumber(
    arr.reduce((pre: any, item) => {
      return pre.div(new Decimal(item));
    }, new Decimal(a))
  );
}
