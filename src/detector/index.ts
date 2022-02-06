import {
  isMACRegx,
  isWINRegx,
  isWeiBoRegx,
  isMobileRegx,
  isWechatRegx,
  isIOSRegx,
  isAndroidRegx,
  appType,
  isTHSHexinGphoneRegx,
  isTHSIHexinRegx,
} from '../data';
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
 * 通用方法获取UA参数
 * @param sign  查询标识（可忽略打小写）
 * @param customUA 自定义传入UA判断
 * @returns 找不到返回 ''
 */
export function getUaQuery(sign: string, customUA?: string): string {
  const { ua } = getUAgent(customUA);
  const _sign = sign.toLowerCase(); // 统一转化成小写
  const idx = ua.indexOf(_sign);
  if (idx < 0) {
    return '';
  }
  // ["[sign/1.4.500]", "sign/1.4.500", "sign", "1.4.500"]
  const re = new RegExp('[\\[\\s]((' + _sign + ')\\/([\\d\\.]+))(?:\\]|\\s|$)', 'i');
  const arr = ua.match(re) || [];
  return arr.length === 4 ? arr[3] : '';
}

/**
 * 获取UA版本号
 * @param {string} sign 查询标识，如hstong
 * @param {string} customUA 自定义传入UA判断
 */
export function uaVersion(sign: string, customUA?: string): string {
  return getUaQuery(sign, customUA);
}

/**
 * 获取App版本号
 * @param {string} sign 查询标识，如hstong
 * @param {string} customUA 自定义传入UA判断
 */
export function appVersion(sign = 'sign', customUA?: string): string {
  return uaVersion(sign, customUA);
}

/**
 * 判断是否是移动端
 *  */
export function isMobile(customUA?: string): boolean {
  const { ua } = getUAgent(customUA);
  return isMobileRegx.test(ua);
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

/**
 * 判断是否是Mac端， 如果需要判断在Mac且在华盛通客户端则需加上inAPP
 * @param {string} customUA 自定义传入UA判断
 */
export function isMAC(customUA?: string): boolean {
  const { ua } = getUAgent(customUA);
  return !isMobile() && isMACRegx.test(ua);
}

/**
 * 判断是否是Win端， 如果需要判断在Win且在华盛通客户端则需加上inAPP
 * @param {string} customUA 自定义传入UA判断
 */
export function isWIN(customUA?: string): boolean {
  const { ua } = getUAgent(customUA);
  return !isMobile() && isWINRegx.test(ua);
}

/**
 * 判断是否是PC
 *  */
export function isPC(customUA?: string): boolean {
  return !isMobile(customUA) && !isAndroid(customUA) && !isIOS(customUA);
}

/**
 * 判断是否在微博
 * @param {string} customUA 自定义传入UA判断
 */
export function isWeiBo(customUA?: string): boolean {
  const { ua } = getUAgent(customUA);
  return isWeiBoRegx.test(ua);
}

/**
 * 判断是否是WeChat平台
 * @param {string} customUA 自定义传入UA判断
 */
export function isWeChat(customUA?: string): boolean {
  const { ua } = getUAgent(customUA);
  return isWechatRegx.test(ua);
}

/**
 * 判断是否嵌入在第三方App中
 * @param {appType} type
 * @param {string} customUA (可选)
 */
export const inSDKAppType = (type: appType[], customUA?: string): boolean => {
  const { ua } = getUAgent(customUA);
  if (!type.length) return false;
  return new RegExp('APPTYPE\\/(' + type.join('|') + ')', 'i').test(ua);
};

/**
 * 判断是否是新浪SDK
 */
export const inSinaFinance = (customUA?: string): boolean => {
  const { ua } = getUAgent(customUA);
  return inSDKAppType([appType.SinaFinanceIOS, appType.SinaFinanceAndroid], ua);
};

/**
 * 获取微信的版本号
 * @returns {string}
 */
export function wechatVersion(customUA?: string): string {
  const { ua } = getUAgent(customUA);
  if (!isWeChat(ua)) {
    return '';
  }
  const re = new RegExp('\\micromessenger\\/([\\d\\.]+)(?:\\(|\\s|$)', 'i');
  const arr = ua.match(re) || [];
  return arr.length === 2 ? arr[1] : '';
}

/**
 * 判断安卓微信版本是否需要弹出照相机
 *  */
export function isWxInAndroidAndNeedCaptureCamera(compareVersion = '7.0.13', customUA?: string): boolean {
  const { ua } = getUAgent(customUA);
  if (!isAndroid(ua)) return false;
  const wechat = wechatVersion(ua);
  if (!wechat) {
    return false;
  }
  const v = wechat.split('(')[0];
  return appVersionComparator(v, compareVersion) >= 0;
}

/**
 * 判断同花顺
 */
export function isTHSHexinGphone(customUA?: string): boolean {
  const { ua } = getUAgent(customUA);
  return isTHSHexinGphoneRegx.test(ua);
}

/**
 * 判断同花顺
 */
export function isTHSIHexin(customUA?: string): boolean {
  const { ua } = getUAgent(customUA);
  return isTHSIHexinRegx.test(ua);
}

/**
 * 获取同花顺APP版本号
 */
export function getTHSAppVersion(customUA?: string): string {
  const { ua } = getUAgent(customUA);
  if (isTHSHexinGphone(ua)) {
    const a = ua.match(/Hexin_Gphone\/\S*/i);
    if (!a?.length) return '';
    return a[0].replace(/Hexin_Gphone\//gi, '');
  }

  if (isTHSIHexin(ua)) {
    const a = ua.match(/IHexin\/\S*/i);
    if (!a?.length) return '';
    return a[0].replace(/IHexin\//gi, '');
  }
  return '';
}

/**
 * 版本比较
 * return：
 * 0 表示相等
 * -1 表示 version1 < version2
 * 1 表示 version1 > version2
 */
export function appVersionComparator(version1: string, version2: string): number {
  const v1: string = version1.trim() || '';
  const v2: string = version2.trim() || '';

  if (!v1 || !v2) {
    throw new TypeError('Version number must be a valid value!');
  }

  const regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)(\.\d+)*$/;
  if (!regex.test(v1) || !regex.test(v2)) {
    throw new TypeError('The version number must be a combination of numbers and commas!');
  }

  const v1Strs: (number | string)[] = v1.split('.');
  const v2Strs: (number | string)[] = v2.split('.');

  if (v1Strs.length > v2Strs.length) {
    const len = v1Strs.length - v2Strs.length;
    for (let i = 0; i < len; i++) {
      v2Strs.push(0);
    }
  }

  if (v1Strs.length < v2Strs.length) {
    const len = v2Strs.length - v1Strs.length;
    for (let i = 0; i < len; i++) {
      v1Strs.push(0);
    }
  }

  let result = 0;
  for (let i = 0; i < v1Strs.length; i++) {
    const v1Val = +v1Strs[i];
    const v2Val = +v2Strs[i];

    if (v1Val === v2Val) {
      result = 0;
    } else if (v1Val < v2Val) {
      result = -1;
    } else if (v1Val > v2Val) {
      result = 1;
    }

    if (result === 0) continue;
    else return result;
  }
  return result;
}
