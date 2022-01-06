import { DataTypes } from '../interfaces';
import { getGlobal } from '../browser';

/**
 * 获取数据类型
 */
export function getDataType(val: unknown): string {
  return Object.prototype.toString
    .call(val)
    .toLowerCase()
    .replace(/(\[object\s|\])/g, '');
}

/**
 * 是否为数字
 * @param val - 待判断值
 * @returns 返回 Boolean
 * @public
 */
export function isNumber(val: unknown): val is number {
  const regPos = /^\d+(\.\d+)?$/; //非负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (typeof val === 'string') return regPos.test(val) || regNeg.test(val);
  return getDataType(val) === DataTypes.number;
}

/**
 * 判断是否是字符串类型
 */
export function isString(val: unknown): val is string {
  return getDataType(val) === DataTypes.string;
}

/**
 * 判断是否是布尔类型
 */
export function isBoolean(val: unknown): val is boolean {
  return getDataType(val) === DataTypes.boolean;
}

/**
 * 判断是否为null
 */
export function isNull(val: unknown): val is null {
  return getDataType(val) === DataTypes.null;
}

/**
 * 判断是否为undefined
 */
export function isUndefined(val: unknown): val is undefined {
  return getDataType(val) === DataTypes.undefined;
}

/**
 * 判断是否为函数
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(val: unknown): val is Function {
  return getDataType(val) === DataTypes.function;
}

/**
 * 判断是否为数组
 */
export function isArray<T = any>(val: unknown): val is Array<T> {
  return getDataType(val) === DataTypes.array;
}

/**
 * 判断是否为时间类型
 */
export function isDate(val: unknown): val is Date {
  return getDataType(val) === DataTypes.date;
}

/**
 * 判断是否为正则类型
 */
export function isRegExp(val: unknown): val is RegExp {
  return getDataType(val) === DataTypes.regExp;
}
/**
 * 判断是否为NaN
 */
export function isNaN(val: unknown): val is number {
  return val !== val;
}

/**
 * 判断是否是对象
 * @param val
 * @param isExact 是否需要精确匹配（忽略数组，函数等）
 * @returns
 */
export function isObject(val: unknown, isExact = false): val is Record<string, unknown> {
  if (isExact) return getDataType(val) === DataTypes.object;
  return !isNull(val) && typeof val === 'object';
}

/**
 * 校验是否为无效值：[NaN,空字符串，null, undefined]
 * @param {unknown} value
 * @param {boolean} ignoreString // 判断是否要忽略String
 * @returns
 */
export function isInvalid(value: unknown, ignoreString = false): boolean {
  const _invalid = isUndefined(value) || isNull(value) || isNaN(value);

  return ignoreString ? _invalid : _invalid || (typeof value === 'string' && !value.trim());
}

/**
 * 是否为异步方法
 */
export function isPromise<T = any>(val: any): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

/**
 * 判断是否是元素
 */
export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName;
}

/**
 * 判断是否为空字段
 */
export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }
  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }
  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }
  return false;
}

/**
 * 判断是否是浏览器
 * 支持 浏览器，服务端
 */
export function isBrowser(): boolean {
  try {
    const global = getGlobal();
    return !isInvalid(global) && global === global?.window;
  } catch {
    return false;
  }
}
