import { isString, isUndefined, isNumber } from '../utils';
import { LogModule } from '../data';

/**
 * 兼容跨浏览器获取目标对象
 * @param ev - 触发事件的对象
 * @returns 触发事件的对象 (某个DOM元素) 的引用
 * @public
 */
export function getTarget(ev: Event): EventTarget {
  if (ev.target) {
    //w3c
    return ev.target;
  } else if (ev.srcElement) {
    //IE
    return ev.srcElement;
  }
  return null;
}

/**
 * 获取全局对象
 * 支持 浏览器，服务端
 * 查找顺序 globalThis window self
 * @public
 */
export function getGlobal(): (Window & typeof globalThis) | typeof globalThis {
  try {
    if (!isUndefined(globalThis)) return globalThis;
  } catch (e) {
    console.log('请忽略 - globalThis 找不到', LogModule.Detector);
  }
  try {
    if (!isUndefined(window)) return window;
  } catch (e) {
    console.log('请忽略 - window 找不到', LogModule.Detector);
  }
  try {
    if (!isUndefined(self)) return self;
  } catch (e) {
    throw new Error('unable to locate global object');
  }
}

/**
 * px计算rem
 * @public
 */
export function calcRem(value: unknown, root = 37.5) {
  const _val = value;
  if (isString(_val) && /px$/.test(_val)) {
    return `${Number(_val.replace(/\D/g, '')) / root}rem`;
  }
  if (isNumber(_val)) {
    return `${_val / root}rem`;
  }
  return _val;
}
