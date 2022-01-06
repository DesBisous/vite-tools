import { ajaxProxy, formProxy } from './vAjaxProxy';
import { isInvalid, isFunction } from '../../utils';
import { BaseObject, Callback, CallbackMessage, MessageType, SendMessage } from 'src/interfaces';
import { isAndroid, isIOS } from 'src/detector';

function createAjaxHook(attr, originFunc) {
  return function (this: XMLHttpRequest, ...args) {
    const xhr: XMLHttpRequest = this;

    if (isFunction(ajaxProxy[attr])) {
      return ajaxProxy[attr].call(xhr, args, originFunc);
    }
    return originFunc.apply(xhr, args);
  };
}

function createFormHook(attr, originFunc) {
  return function (this: HTMLFormElement, ...args) {
    const form: HTMLFormElement = this;

    if (isFunction(formProxy[attr])) {
      return formProxy[attr].call(form, args, originFunc);
    }
    return originFunc.apply(form, args);
  };
}

export function setupAjaxHook() {
  /**
   * Ajax
   */
  for (const attr in XMLHttpRequest.prototype) {
    try {
      if (isInvalid(XMLHttpRequest.prototype[attr])) continue;
      if (isFunction(XMLHttpRequest.prototype[attr])) {
        const originFunc = XMLHttpRequest.prototype[attr];
        XMLHttpRequest.prototype[attr] = createAjaxHook(attr, originFunc);
      }
    } catch (e) {
      // console.log('Ajax Error:', e);
    }
  }
  /**
   * Form
   */
  for (const attr in HTMLFormElement.prototype) {
    try {
      if (isInvalid(HTMLFormElement.prototype[attr])) continue;
      if (isFunction(HTMLFormElement.prototype[attr])) {
        const originFunc = HTMLFormElement.prototype[attr];
        HTMLFormElement.prototype[attr] = createFormHook(attr, originFunc);
      }
    } catch (e) {
      // console.log('Form Error:', e);
    }
  }
}

/**
 * 用于处理来自 Native 的消息
 * @param message 回调消息
 */
export function onMessageFromNative(message) {
  const callbackMessage: CallbackMessage = JSON.parse(message);
  if (callbackMessage.messageType === MessageType.Callback) {
    // 回调消息
    const callback: Callback = window['KKJSBridgeConfig']['callbackCache'][callbackMessage.callbackId];
    if (callback) {
      // 执行 callback 回调，并删除缓存的 callback
      callback(callbackMessage.data);
      window['KKJSBridgeConfig']['callbackCache'][callbackMessage.callbackId] = null;
      delete window['KKJSBridgeConfig']['callbackCache'][callbackMessage.callbackId];
    }
  } else if (callbackMessage.messageType === MessageType.Event) {
    // 暂不处理
    // 事件消息
    // 支持批量事件调用
    // let obsevers: [KK.EventCallback] = this.eventCallbackCache[callbackMessage.eventName];
    // if (obsevers) {
    //   for (let i = 0; i < obsevers.length; i++) {
    //     let eventCallback: KK.EventCallback = obsevers[i];
    //     if (eventCallback) {
    //       eventCallback(callbackMessage.data);
    //     }
    //   }
    // }
  }
}

/**
 * 异步调用方法
 * @param module 模块
 * @param method 方法
 * @param data 数据
 * @param callback 调用回调
 */
let uniqueId = 1;
export function callNative(module: string, method: string, data: BaseObject, callback?: Callback) {
  const message: SendMessage = {
    module: module || 'default',
    method,
    data: data,
  };

  if (callback) {
    // 拼装 callbackId
    const callbackId: string = 'cb_' + message.module + '_' + method + '_' + uniqueId++ + '_' + Date.now();
    // 缓存 callback，用于在 Native 处理完消息后，通知 H5
    window['KKJSBridgeConfig']['callbackCache'][callbackId] = callback;
    // 追加 callbackId 属性
    message['callbackId'] = callbackId;
  }

  // 发送消息给 Native
  if (isIOS()) {
    // IOS
    window['webkit']['messageHandlers']['IMYXHR']['postMessage'](message);
  }
  if (isAndroid()) {
    // Android
    window['IMYXHR']['postMessage'](message);
  }
  console.log('postMessage:', message);
}

export function setJSBridge() {
  // KKJSBridge
  if (isInvalid(window['KKJSBridge'])) window['KKJSBridge'] = {};
  window['KKJSBridge']['_handleMessageFromNative'] = onMessageFromNative;
  window['KKJSBridge']['call'] = callNative;
  // KKJSBridgeConfig
  window['KKJSBridgeConfig'] = {};
  if (isInvalid(window['KKJSBridgeConfig']['ajaxHook'])) window['KKJSBridgeConfig']['ajaxHook'] = true;
  if (isInvalid(window['KKJSBridgeConfig']['callbackCache'])) window['KKJSBridgeConfig']['callbackCache'] = {};
}
