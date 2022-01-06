import { loadJS } from '../utils';
import { PluginKey, PluginUrl, EncryptKey } from '../data';

let cryptor: any = null;
const encryptKey = {
  default: EncryptKey,
};

/**
 * 构建 Cryptor
 * @param {string} loadUrl 加载js地址
 * @param {boolean} isSingle 判断是否需要单例
 * @returns
 */
function createCryptor(loadUrl = PluginUrl.JSEncrypt, isSingle = true): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      if (isSingle && cryptor) {
        resolve(cryptor);
        return;
      }
      loadJS(loadUrl, PluginKey.JSEncrypt, 'JSEncrypt').then((JSEncrypt: any) => {
        cryptor = new JSEncrypt({}) as any;
        if (!cryptor) {
          reject(Error('初始化crypt 失败'));
        }
        resolve(cryptor);
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * 使用 JSEncrypt 加密
 * @param {string} content - 加密内容
 * @param {string} key - 公钥
 * @param {string} loadUrl 加载js地址
 * @param {boolean} isSingle 判断是否需要单例
 * @returns - 加密结果
 * @public
 */
export async function encrypt(
  content: string,
  key: string = encryptKey.default.publicKey,
  loadUrl = PluginUrl.JSEncrypt,
  isSingle = true
): Promise<string | false> {
  if (typeof key !== 'string' || typeof content !== 'string') return content;
  const cryptor = await createCryptor(loadUrl, isSingle);
  cryptor.setPublicKey(key); //设置公钥
  return cryptor.encrypt(content); // 对内容进行加密
}

/**
 * 使用 JSEncrypt 解密
 * @param {string}content - 解密内容
 * @param {string} key - 私钥
 * @param {string} loadUrl 加载js地址
 * @param {boolean} isSingle 判断是否需要单例
 * @returns - 解密结果
 * @public
 */
export async function decrypt(
  content: string,
  key: string = encryptKey.default.privateKey,
  loadUrl = PluginUrl.JSEncrypt,
  isSingle = true
): Promise<string | false> {
  if (typeof key !== 'string' || typeof content !== 'string') return content;
  const cryptor = await createCryptor(loadUrl, isSingle);
  cryptor.setPrivateKey(key); //设置秘钥
  return cryptor.decrypt(content); //解密之前拿公钥加密的内容
}
