import { GeneralObject } from '../interfaces/common';
/**
 * 获取目录中的文件内容
 * @param context - require.context 返回值
 * @param extRegExp - 匹配正则
 * @param keyRegExpCb - 自定义回调，进一步处理 key
 * @returns 文件名为 key，文件内容为 value 的对象
 * @public
 */
export function importAll(
  context: __WebpackModuleApi.RequireContext,
  extRegExp = /\.js$/,
  keyRegExpCb = (key: string) => key
): GeneralObject {
  const modules: GeneralObject = {};
  const replace = (str: string) => str.replace(/.\//g, '').replace(extRegExp, '');

  context.keys().forEach((key: string) => {
    const name = keyRegExpCb(replace(key));
    if (name) modules[name] = context(key).default ? context(key).default : context(key);
  });

  return modules;
}
