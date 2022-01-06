import { BaseObject } from './common';

type BodyType = 'String' | 'Blob' | 'FormData' | 'ArrayBuffer';
type FormEnctype = 'application/x-www-form-urlencoded' | 'text/plain' | 'multipart/form-data' | string;

/**
 * 回调消息类型
 */
export const enum MessageType {
  /**
   * 回调消息
   */
  Callback = 'callback',
  /**
   * 事件消息
   */
  Event = 'event',
}

export interface AJAXBodyCacheRequest {
  /**
   * 请求唯一id
   */
  requestId: string;
  /**
   * 当前 href url
   */
  requestHref: string;
  /**
   * 请求 Url
   */
  requestUrl: string;
  /**
   * body 类型
   */
  bodyType: BodyType;

  /**
   * 表单编码类型
   */
  formEnctype?: FormEnctype;
  /**
   * body 具体值
   */
  value: any;
}

export interface AJAXBodyCacheCallback {
  /**
   * 请求唯一id
   */
  requestId: string;

  /**
   * 回调
   */
  callback: () => any;
}

export interface FormDataFile {
  /**
   * 文件名
   */
  name: string;
  /**
   * 修改时间
   */
  lastModified?: number;
  /**
   * 文件大小
   */
  size?: number;
  /**
   * 文件 MIME 类型
   */
  type?: string;
  /**
   * 文件数据
   */
  data?: string;
}

/**
 * 发送过消息体
 */
export interface SendMessage {
  /**
   * 模块
   */
  module?: string;
  /**
   * 方法
   */
  method: string;
  /**
   * 数据
   */
  data: BaseObject;
  /**
   * 回调id
   */
  callbackId?: string;
}

/**
 * 回调消息体
 */
export interface CallbackMessage {
  /**
   * 回调消息类型
   */
  messageType: MessageType;
  /**
   * 回调方法id
   */
  callbackId?: string;
  /**
   * 回调事件名称
   */
  eventName?: string;
  /**
   * 回调数据
   */
  data: any;
}

/**
 * 回调函数
 */
export type Callback = (data: BaseObject) => void;
