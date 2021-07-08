/**
 * 函数防抖
 * @param func - 回调函数
 * @param wait - 延迟执行毫秒数
 * @param immediate - true 表立即执行，false 表非立即执行
 * @returns 返回新防抖函数
 * @public
 */
export function debounce(func: () => void, wait: number, immediate?: boolean): () => void {
  let timeout: NodeJS.Timeout;

  return function (this: any, ...args: []) {
    const context = this as any;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}

/**
 * 函数节流
 * @param func - 函数
 * @param wait - 延迟执行毫秒数
 * @param type - 1 表时间戳版，2 表定时器版
 * @returns 返回新防抖函数
 * @public
 */
export function throttle(func: () => void, wait: number, type = 2): () => void {
  let previous = 0;
  let timeout: NodeJS.Timeout;

  return function (this: any, ...args: []) {
    const context = this as any;
    if (type === 1) {
      const now = Date.now();

      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    }
  };
}
