/**
 * Hook FormData，由于低版本的 FormData 没有支持 entries() 等遍历 api，所以只是在 ajax send 里遍历，是无法获取到具体的值的，
 * 所以针对低版本的 iOS 系统做 Hook FormData 处理。
 */
export function setupFormHook() {
  const originAppend = window['FormData']['prototype']['append'];
  const originEntries = window['FormData']['prototype']['entries'];
  if (!originEntries) {
    window['FormData']['prototype']['append'] = function (...args) {
      if (!this['_entries']) {
        this['_entries'] = [];
      }
      this['_entries'].push(args);
      return originAppend.apply(this, args);
    };
  }
}
