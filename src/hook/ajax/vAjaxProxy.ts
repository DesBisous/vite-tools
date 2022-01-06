import { isInvalid } from 'src';
import { AJAXBodyCacheRequest } from 'src/interfaces';
import { xhrKey } from './vAjaxData';
import {
  getRequestId,
  getUrlByParam,
  isNonNormalHttpRequest,
  convertArrayBufferToBase64,
  sendBodyToNativeForCache,
  convertFormDataToJson,
} from './vAjaxUtils';

export const ajaxProxy = {
  open: function (this: XMLHttpRequest, args, originFunc) {
    const xhr: XMLHttpRequest = this;
    const [method, url, async] = args;
    // 生成唯一请求id
    xhr['requestId'] = getRequestId();
    xhr['requestMethod'] = method;
    xhr['requestUrl'] = url;
    xhr['requestAsync'] = async;
    xhr['requestHref'] = document.location.href;

    if (isNonNormalHttpRequest(url, method)) {
      // 如果是非正常请求，则调用原始方法
      return originFunc.apply(xhr, args);
    }

    if (!window['KKJSBridgeConfig']['ajaxHook']) {
      // 如果没有开启 ajax hook，则调用原始方法
      return originFunc.apply(xhr, args);
    }

    // 生成新的 url
    args[1] = getUrlByParam(url, { [xhrKey]: xhr['requestId'] });
    return originFunc.apply(xhr, args);
  },
  send: function (this: XMLHttpRequest, args, originFunc) {
    const xhr: XMLHttpRequest = this;
    const body = args[0];
    const request = {
      requestId: xhr['requestId'],
      requestHref: xhr['requestHref'],
      requestUrl: xhr['requestUrl'],
      bodyType: 'String',
      value: null,
    };

    if (isNonNormalHttpRequest(xhr['requestUrl'], xhr['requestMethod'])) {
      // 如果是非正常请求，则调用原始方法
      return originFunc.apply(xhr, args);
    }

    if (!window['KKJSBridgeConfig']['ajaxHook']) {
      // 如果没有开启 ajax hook，则调用原始方法
      return originFunc.apply(xhr, args);
    }

    if (!body) {
      // 没有 body，调用原始 send
      return originFunc.apply(xhr, args);
    } else if (body instanceof ArrayBuffer) {
      // 说明是 ArrayBuffer，转成 base64
      request['bodyType'] = 'ArrayBuffer';
      request['value'] = convertArrayBufferToBase64(body);
    } else if (body instanceof Blob) {
      // 说明是 Blob，转成 base64
      request['bodyType'] = 'Blob';
      const fileReader: FileReader = new FileReader();
      fileReader.onload = function (this: FileReader, ev: ProgressEvent) {
        const base64: string = (ev.target as any).result;
        request['value'] = base64;
        sendBodyToNativeForCache('AJAX', xhr, originFunc, args, request as AJAXBodyCacheRequest);
      };

      fileReader.readAsDataURL(body);
      return;
    } else if (body instanceof FormData) {
      // 说明是表单
      request['bodyType'] = 'FormData';
      request['formEnctype'] = 'multipart/form-data';
      convertFormDataToJson(body, (json: any) => {
        request['value'] = json;
        sendBodyToNativeForCache('AJAX', xhr, originFunc, args, request as AJAXBodyCacheRequest);
      });
      return;
    } else {
      // 说明是字符串或者json
      request['bodyType'] = 'String';
      request['value'] = body;
    }
    // 发送到 native 缓存起来
    sendBodyToNativeForCache('AJAX', xhr, originFunc, args, request as AJAXBodyCacheRequest, xhr['requestAsync']);
  },
};

export const formProxy = {
  submit: function (this: HTMLFormElement, args, originFunc) {
    const form: HTMLFormElement = this;

    form['requestId'] = getRequestId();
    form['requestUrl'] = form.action;
    form['requestHref'] = document.location.href;

    const request: AJAXBodyCacheRequest = {
      requestId: form['requestId'],
      requestHref: form['requestHref'],
      requestUrl: form['requestUrl'],
      bodyType: 'FormData',
      formEnctype: form['enctype'],
      value: null,
    };

    if (isInvalid(form.action)) {
      // 如果是非正常请求，则调用原始方法
      return originFunc.apply(form, args);
    }

    if (!window['KKJSBridgeConfig']['ajaxHook']) {
      // 如果没有开启 ajax hook，则调用原始方法
      return originFunc.apply(form, args);
    }

    const formData: any = new FormData(form);

    convertFormDataToJson(formData, (json: any) => {
      request['value'] = json;
      sendBodyToNativeForCache('FORM', form, originFunc, args, request);
    });
  },
};
