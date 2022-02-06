import { isInvalid } from './validate';

let decimal = null;

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
 * 将数据转成数字类型
 * @param {number} value 值
 * @returns
 */
export function mathToNumber(value: any): number {
  return value.toNumber();
}

export async function getDecimal() {
  if (decimal) return decimal;
  return new Promise(resolve => {
    import('decimal.js').then(module => {
      decimal = module.default;
      resolve(decimal);
    });
  });
}

/**
 * 新: 四舍五入
 * @param {number} value 值
 * @param {number} num 位数 默认两位
 * @returns
 */
export async function mathToFixed(value: number, options: { num?: number }): Promise<string> {
  const _options = { num: 2, ...options };
  const Decimal = await getDecimal();
  return new Decimal(value).toFixed(_options.num);
}

/**
 * 加法
 */
export async function mathAdd(value: number, ...arr: number[]): Promise<number> {
  const Decimal = await getDecimal();
  return mathToNumber(
    arr.reduce((pre: any, item) => {
      return pre.add(new Decimal(item));
    }, new Decimal(value))
  );
}

/**
 * 减法
 */
export async function mathSubStract(a: number, ...arr: number[]): Promise<number> {
  const Decimal = await getDecimal();
  return mathToNumber(
    arr.reduce((pre: any, item) => {
      return pre.sub(new Decimal(item));
    }, new Decimal(a))
  );
}

/**
 * 乘法
 */
export async function mathMultiply(a: number, ...arr: number[]): Promise<number> {
  const Decimal = await getDecimal();
  return mathToNumber(
    arr.reduce((pre: any, item) => {
      return pre.mul(new Decimal(item));
    }, new Decimal(a))
  );
}

/**
 * 除法
 */
export async function mathDivide(a: number, ...arr: number[]): Promise<number> {
  const Decimal = await getDecimal();
  return mathToNumber(
    arr.reduce((pre: any, item) => {
      return pre.div(new Decimal(item));
    }, new Decimal(a))
  );
}
