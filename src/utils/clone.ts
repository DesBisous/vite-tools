/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * 深度克隆
 * @param origin - 待克隆值
 * @param hasMap - 克隆存储集合
 * @returns 克隆值
 * @public
 */
export function deepClone(origin: any, hasMap = new WeakMap()): any {
  if (!origin || typeof origin !== 'object' || origin === null) return origin; // 空或者非对象则返回本身

  if (origin instanceof Date) {
    return new Date(origin);
  }

  if (origin instanceof RegExp) {
    return new RegExp(origin);
  }

  // 如果这个对象已经被记录则直接返回
  if (hasMap.get(origin)) {
    return hasMap.get(origin);
  }

  // 这个对象还没有被记录，将其引用记录在 hasMap 中，进行拷贝
  const result = new origin.constructor();

  hasMap.set(origin, result); // 记录引用关系

  for (const key in origin) {
    if (Object.hasOwnProperty.call(origin, key)) {
      result[key] = deepClone(origin[key], hasMap);
    }
  }
  return result;
}
