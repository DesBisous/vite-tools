/**
 * 获取地址的参数，指定的参数
 * @param name - url 参数名
 */
export const getQuery = (name: string): string | undefined => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r === null) return;
  return unescape(r[2]);
};
