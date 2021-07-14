export enum LangCodeDefault {
  zhCN = 'zh_CN',
  enUS = 'en_US',
  zhHK = 'zh_HK',
}

export interface ILangOptions {
  zhCN: LangCodeDefault.zhCN | string;
  enUS: LangCodeDefault.enUS | string;
  zhHK: LangCodeDefault.zhHK | string;
}
