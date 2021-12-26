/**
 * 等待函数
 * @param timeSpan 等待时长
 * @returns 无返回
 * @public
 */
export async function wait(timeSpan = 600): Promise<never> {
  return new Promise(resolve => {
    setTimeout(resolve, timeSpan);
  });
}
