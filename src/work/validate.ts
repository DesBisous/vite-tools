/**
 * 校验是否为无效值：[空字符串，null, undefined]
 * @param value - 待判断值
 * @returns 返回 Boolean
 * @public
 */
export function isInvalid(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  // 空字符串
  if (typeof value === 'string' && !value.trim()) {
    return true;
  }
  return false;
}

/**
 * 判断是否是对象
 * @param val - 待判断值
 * @returns 返回 Boolean
 * @public
 */
export function isObject(val: unknown): boolean {
  return val !== null && typeof val === 'object';
}

/**
 * 是否为数字
 * @param val - 待判断值
 * @returns 返回 Boolean
 * @public
 */
export function isNumber(val: unknown): boolean {
  const regPos = /^\d+(\.\d+)?$/; //非负浮点数
  const regNeg =
    /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  return regPos.test(`${val}`) || regNeg.test(`${val}`);
}
