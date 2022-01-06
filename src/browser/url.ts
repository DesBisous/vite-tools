import { isBrowser } from '../utils/validate';
import { getGlobal } from './element';

/**
 * 获取地址的参数，指定的参数
 * 支持 浏览器，服务端
 * @param {string} name
 * @param {string} url (可选参数), 外部传入链接匹配
 */
export function getQuery(name: string, url?: string): string | undefined {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const _url = url || (isBrowser() ? getGlobal().location.search : null);
  if (!_url) return;
  const result = _url.substr(1).match(reg);
  if (result === null) return;
  return unescape(result[2]);
}
