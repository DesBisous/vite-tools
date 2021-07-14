import { getQuery } from '../browser/url';
import { LangCodeDefault, ILangOptions } from '../interfaces/lang';

const langCodesRegx = /(ZH(_|-)(CN|TW|HK)|EN(_|-)(UK|US))/i;
const langCodesUAgentRegx = /LANG\/(ZH(_|-)(CN|TW|HK)|EN(_|-)(UK|US))/i;

/**
 * 获取UA语言类型
 * @param {string} lang 默认值
 * @returns
 */
export const getLangCodeUAgent = (lang?: string): string | undefined => {
  const UA = window.navigator.userAgent;

  const result = langCodesUAgentRegx.exec(UA);
  return result ? result[1] : lang || LangCodeDefault.zhCN;
};

/**
 * 通过Url获取语言
 * @param {string} lang 默认值
 * @returns
 */
export const getLangCodeUrl = (l?: string): string | undefined => {
  const locale = getQuery('locale');
  if (locale && langCodesRegx.test(locale)) return locale;
  const _lang = getQuery('_lang');
  if (_lang && langCodesRegx.test(_lang)) return _lang;
  const lang = getQuery('lang');
  if (lang && langCodesRegx.test(lang)) return lang;
  // 如果是hk默认返回繁体，否则返回简体
  if (/^hk/.test(window.location.host)) return LangCodeDefault.zhHK;
  return l;
};

const formatLangCode = (lang: string, langOptions: ILangOptions): string => {
  // 判断是语言类型
  // 繁体
  if (/ZH(-|_)(TW|HK)/i.test(lang)) {
    return langOptions.zhHK;
  }
  // 英文
  if (/EN(_|-)(UK|US)/i.test(lang)) {
    return langOptions.enUS;
  }
  // 简体
  return langOptions.zhCN;
};

/**
 * 获取当前语言，优先获取地址，然后获取UA, 其次获取默认值
 * @param {object} langOptions
 * @param {string} zhCN 简体默认值
 * @param {string} zhHK 繁体默认值
 * @param {string} enUS 英文默认值
 * @returns
 */
export const getLangCode = (
  langOptions: ILangOptions = {
    zhCN: LangCodeDefault.zhCN,
    zhHK: LangCodeDefault.zhHK,
    enUS: LangCodeDefault.enUS,
  }
): string => {
  const urlLangCode = getLangCodeUrl();
  if (urlLangCode) {
    return formatLangCode(urlLangCode, langOptions);
  }

  const uAgentLangCode = getLangCodeUAgent();
  if (uAgentLangCode) {
    return formatLangCode(uAgentLangCode, langOptions);
  }

  return LangCodeDefault.zhCN;
};
