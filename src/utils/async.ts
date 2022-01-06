/**
 * 等待函数
 * @param timeSpan 等待时长
 * @returns 无返回
 * @public
 */
export async function wait(timeSpan = 1000): Promise<never> {
  return new Promise(resolve => {
    setTimeout(resolve, timeSpan);
  });
}

/**
 * promise捕获方法
 * @param promise
 * @returns
 */
export function tryCatch<T>(promise: Promise<T>) {
  return promise
    .then(res => {
      return [null, res];
    })
    .catch(err => [err]);
}
