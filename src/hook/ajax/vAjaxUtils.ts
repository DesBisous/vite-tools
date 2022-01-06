import { xhrKey, globalId, moduleName, excludeUrl } from './vAjaxData';
import { AJAXBodyCacheRequest, AJAXBodyCacheCallback } from '../../interfaces';
import { isInvalid } from '../../utils';
import { convertSingleFormDataRecordToArray, traversalEntries } from '../form/vFormUtils';

let increasing = 1;

/**
 * 生成 ajax 请求唯一id
 */
export function getRequestId(): string {
  // 时间戳 + 当前上下文唯一id，生成请求id
  return Date.now() + '' + (globalId + increasing++);
}

/**
 * 是否是非正常的 http 请求。比如 url: blob:https:// 场景下，去发送 XMLHTTPRequest，会导致请求失败
 */
export function isNonNormalHttpRequest(url: string, httpMethod: string): boolean {
  const pattern = /^((http|https):\/\/)/;
  const isNonNormalRequest =
    (!pattern.test(url) && httpMethod === 'GET') || excludeUrl.some(item => url.includes(item));
  return isNonNormalRequest;
}

/**
 * 给 url 增加参数
 */
export function getUrlByParam(url, params): string {
  const isParamName = (e, name) => new RegExp(`[?|&]${name}=`).test(url);
  let newUrl = url;
  for (const key in params) {
    if (isParamName(url, key)) {
      newUrl = newUrl.replace(new RegExp(`([?|&]${key}=).*?(&|$)`), `$1${params[key]}$2`);
    } else {
      if (newUrl.split('?')[1]) {
        newUrl += ['&', key, '=', params[key]].join('');
      } else {
        newUrl += ['?', key, '=', params[key]].join('');
      }
    }
  }
  return newUrl;
}

/**
 * 给表单生成新的 action
 */
export function setNewActionForForm(form: HTMLFormElement, requestId: string) {
  const orignAction: string = form.action;
  form.action = getUrlByParam(orignAction, { [xhrKey]: requestId });
}

/**
 * 把 arraybuffer 转成 base64
 * @param arraybuffer
 */
export function convertArrayBufferToBase64(arraybuffer: ArrayBuffer) {
  let charCode = '';
  const uint8Array: Uint8Array = new Uint8Array(arraybuffer);
  const length = uint8Array.byteLength;
  for (let i = 0; i < length; i++) {
    charCode += String.fromCharCode(uint8Array[i]);
  }
  // 字符串转成base64
  return window.btoa(charCode);
}

/**
 * 转换 form 表单到 json 对象
 * @param formData
 * @param callback
 */
export function convertFormDataToJson(formData: any, callback: (json: any) => void) {
  const allPromise: Array<Promise<Array<any>>> = [];

  traversalEntries(formData, (key: string, value: any, fileName?: string) => {
    allPromise.push(convertSingleFormDataRecordToArray(key, value, fileName));
  });

  Promise.all(allPromise)
    .then((formDatas: Array<Array<any>>) => {
      const formDataJson: any = {};
      const formDataFileKeys = [];

      for (const pair of formDatas) {
        const singleKeyValue: Array<any> = pair;
        // 只要不是字符串，那就是一个类文件对象，需要加入到 formDataFileKeys 里，方便 native 做编码转换
        if (singleKeyValue.length > 1 && !(typeof singleKeyValue[1] == 'string')) {
          formDataFileKeys.push(singleKeyValue[0]);
        }
      }
      formDataJson['fileKeys'] = formDataFileKeys;
      formDataJson['formData'] = formDatas;
      callback(formDataJson);
    })
    .catch(function (error: Error) {
      console.log(error);
    });
}

/**
 * 发送 body 到 native 侧缓存起来
 * @param xhr
 * @param originMethod
 * @param originArguments
 * @param body
 */
export function sendBodyToNativeForCache(
  targetType: 'AJAX' | 'FORM',
  target: XMLHttpRequest | HTMLFormElement,
  originMethod: any,
  originArguments: any,
  request: AJAXBodyCacheRequest,
  requestAsync = true
) {
  /*
			ajax 同步请求只支持纯文本数据，不支持 Blob 和 FormData 数据。
			如果要支持的话，必须使用 FileReaderSync 对象，但是该对象只在 workers 里可用，
			因为在主线程里进行同步 I/O 操作可能会阻塞用户界面。
			https://developer.mozilla.org/zh-CN/docs/Web/API/FileReaderSync
		*/
  const requestId: string = target['requestId'];
  const cacheCallback: AJAXBodyCacheCallback = {
    requestId: requestId,
    callback: () => {
      // Ajax 采用从 url 上增加 id 参数带上，就不在 header 上加了
      // if (targetType === "AJAX") {// ajax
      //   // 发送之前设置自定义请求头，好让 native 拦截并从缓存里获取 body
      //   target.setRequestHeader("KKJSBridge-RequestId", requestId);
      // }

      if (targetType === 'FORM') {
        // 表单 submit
        // 发送之前修改 action，让 action 带上 requestId
        setNewActionForForm(target as HTMLFormElement, requestId);
      }

      // 调用原始 send 方法
      return originMethod.apply(target, originArguments);
    },
  };

  if (requestAsync) {
    // 异步请求
    // 缓存 callbcak
    window['KKJSBridgeConfig']['callbackCache'][requestId] = cacheCallback;
    // 发送 body 请求到 native
    window['KKJSBridge'].call(moduleName, 'cacheAJAXBody', request, (message: any) => {
      // 处理 native 缓存完毕后的消息
      const callbackFromNative: AJAXBodyCacheCallback = message;
      const requestId: string = callbackFromNative.requestId;
      // 通过请求 id，找到原始 send 方法并调用
      if (window['KKJSBridgeConfig']['callbackCache'][requestId]) {
        const callbackFromNative: AJAXBodyCacheCallback = window['KKJSBridgeConfig']['callbackCache'][requestId];
        if (!isInvalid(callbackFromNative) && !isInvalid(callbackFromNative.callback)) {
          callbackFromNative.callback();
        }
        delete window['KKJSBridgeConfig']['callbackCache'][requestId];
      }
    });
    return;
  }

  // 同步请求
  // 发送 body 请求到 native
  window['KKJSBridge'].call(moduleName, 'cacheAJAXBody', request);
  // 发送完成后继续请求原始 send 方法
  cacheCallback.callback();
}
