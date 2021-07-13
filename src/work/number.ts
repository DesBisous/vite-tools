import { isInvalid, isNumber } from './validate';

/**
 * 四舍五入
 * @param value - 值
 * @param num - 保留位数，默认两位
 * @returns 返回格式化后结果
 * @public
 */
export function bitSept(value: number | string, num = 2): string {
  if (!isNumber(value) || isInvalid(value)) {
    return '0.00';
  }
  const numStr = value + '';
  if (!/\./.test(numStr)) {
    const _numInt = numStr + '.';
    return _numInt.padEnd(_numInt.length + num, '0');
  }
  let floatValue = parseFloat(numStr);
  const powNum = Math.pow(10, num);
  const tempNumber = floatValue * powNum;
  floatValue = Math.round(tempNumber) / powNum;
  const _str = (floatValue + '').split('.');
  if (_str.length === 1) return _str[0];
  return `${_str[0]}.${_str[1].padEnd(num, '0')}`;
}
