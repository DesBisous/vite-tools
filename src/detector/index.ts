import { isAndroidRegx, isIOSRegx } from '../data';
import { getGlobal } from '../browser';

/**
 * 获取 ua
 * @param {string} customUA 自定义传入UA判断
 */
export function getUAgent(customUA?: string): {
  UA: string;
  ua: string;
} {
  const _UA = customUA ?? getGlobal()?.navigator.userAgent;
  return {
    UA: _UA,
    ua: _UA.toLowerCase(),
  };
}

/**
 * 判断是否是Android
 * @param {string} customUA 自定义传入UA判断
 */
export function isAndroid(customUA?: string): boolean {
  const { ua } = getUAgent(customUA);
  return isAndroidRegx.test(ua);
}

/**
 * 判断是否是IOS
 * @param {string} customUA 自定义传入UA判断
 */
export function isIOS(customUA?: string): boolean {
  const { ua } = getUAgent(customUA);
  return isIOSRegx.test(ua);
}
