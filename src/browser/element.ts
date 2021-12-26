/**
 * 兼容跨浏览器获取目标对象
 * @param ev 触发事件的对象
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
