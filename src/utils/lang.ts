import { getUAgent } from '../detector';
import { isBrowser, isObject } from './validate';
import { getGlobal, getQuery } from '../browser';
import { BaseObject } from 'src/interfaces';

const langCodesRegx = /(ZH(_|-)(CN|TW|HK)|EN(_|-)(UK|US))/i;
enum LangCodeDefault {
  zhCN = 'zh_CN',
  enUS = 'en_US',
  zhHK = 'zh_HK',
}

/**
 * 获取UA语言类型
 * @param {string} customUA 自定义传入UA判断
 * @param {string} lang 默认值
 * @returns
 */
export const getLangCodeUAgent = (customUA?: string, lang?: string): string | undefined => {
  const { ua } = getUAgent(customUA);

  const result = /LANG\/(ZH(_|-)(CN|TW|HK)|EN(_|-)(UK|US))/i.exec(ua);
  return result ? result[1] : lang || (isBrowser() ? getGlobal().navigator.language : '') || LangCodeDefault.zhCN;
};

const getClientQuery = (arr: string[]): { [key: string]: string } => {
  return arr.reduce((pre: { [key: string]: string }, key) => {
    const _value = getQuery(key);
    // 判断是否存在
    if (_value) {
      pre[key] = _value;
    }
    return pre;
  }, {});
};

type ILangCodeUrl = { host: string; query: { [key: string]: string }; defaultLang?: string } | string;

/**
 * 通过Url获取语言
 * @param {string} lang 默认值
 * @returns
 */
export const getLangCodeUrl = (l?: ILangCodeUrl): string | LangCodeDefault | undefined => {
  const options = isObject(l)
    ? l
    : {
        host: window.location.host, // 当前的域名
        defaultLang: l, // 默认值
        query: getClientQuery(['locale', '_lang', 'lang']),
      };

  const locale = options.query['locale'];
  if (locale && langCodesRegx.test(locale)) return locale;

  const _lang = options.query['_lang'];
  if (_lang && langCodesRegx.test(_lang)) return _lang;

  const lang = options.query['lang'];
  if (lang && langCodesRegx.test(lang)) return lang;

  // 如果是hk默认返回繁体，否则返回简体
  if (/^hk/.test(options.host)) return LangCodeDefault.zhHK;
  return options.defaultLang;
};

/**
 * 判断是否是简体
 * @param {string} lang
 */
export function isZhCN(lang: string): boolean {
  return /ZH(-|_)CN/i.test(lang);
}

/**
 * 判断是否是繁体
 * @param {string} lang
 */
export function isZhHK(lang: string): boolean {
  return /ZH(-|_)(TW|HK)/i.test(lang);
}

/**
 * 判断是否是英文
 * @param {string} lang
 */
export function isEnUS(lang: string): boolean {
  return /EN(_|-)(UK|US)/i.test(lang);
}

interface ILangOptions {
  zhCN: LangCodeDefault | string;
  enUS: LangCodeDefault | string;
  zhHK: LangCodeDefault | string;
}
const formatLangCode = (lang: string, langOptions: ILangOptions): LangCodeDefault | string => {
  // 判断是语言类型
  // 繁体
  if (isZhHK(lang)) {
    return langOptions.zhHK;
  }
  // 英文
  if (isEnUS(lang)) {
    return langOptions.enUS;
  }
  // 简体
  return langOptions.zhCN;
};

/**
 * 客户端调用的方法
 * 获取当前语言，优先获取地址，然后获取UA, 其次获取默认值
 * @param {object} langOptions
 * @param {string} zhCN 简体默认值
 * @param {string} zhHK 繁体默认值
 * @param {string} enUS 英文默认值
 * @returns
 */
export const getLangCode = (
  options: ILangOptions = {
    zhCN: LangCodeDefault.zhCN,
    zhHK: LangCodeDefault.zhHK,
    enUS: LangCodeDefault.enUS,
  }
): string => {
  // 获取地址上的Url链接
  const urlLangCode = getLangCodeUrl();
  if (urlLangCode) {
    return formatLangCode(urlLangCode, options);
  }

  // 获取UA上的链接
  const uAgentLangCode = getLangCodeUAgent();
  if (uAgentLangCode) {
    return formatLangCode(uAgentLangCode, options);
  }

  return LangCodeDefault.zhCN;
};

/**
 * 服务端调用的方法
 * 获取当前语言，优先获取地址，然后获取UA, 其次获取默认值
 * @param {object} langOptions
 * @param {string} zhCN 简体默认值
 * @param {string} zhHK 繁体默认值
 * @param {string} enUS 英文默认值
 * @returns
 */
export function getLangCodeByServer({
  host = '',
  query = {},
  ua = '',
  langOptions = LangCodeDefault,
}: {
  host: string;
  query: BaseObject;
  ua: string;
  langOptions: ILangOptions;
}): string {
  const urlLangCode = getLangCodeUrl({
    host,
    query,
  });
  if (urlLangCode) {
    return formatLangCode(urlLangCode, langOptions);
  }

  const uAgentLangCode = getLangCodeUAgent(ua);
  if (uAgentLangCode) {
    return formatLangCode(uAgentLangCode, langOptions);
  }

  return LangCodeDefault.zhCN;
}
