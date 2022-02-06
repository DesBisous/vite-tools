import { isObject, isString } from '../utils';

const localStorage = {
  get(name: string) {
    const value = window.localStorage.getItem(name);
    if (!value) return '';
    if (isString(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  set(name: string, value: string | Record<string, unknown>) {
    const val = value && isObject(value) ? JSON.stringify(value) : value + '';
    return window.localStorage.setItem(name, val);
  },
  remove(name: string) {
    return window.localStorage.removeItem(name);
  },
  clear() {
    return window.localStorage.clear();
  },
};

const sessionStorage = {
  get(name: string) {
    const value = window.sessionStorage.getItem(name);
    if (!value) return '';
    if (isString(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  set(name: string, value: string | Record<string, unknown> | any) {
    const val = value && typeof value === 'object' ? JSON.stringify(value) : value;
    return window.sessionStorage.setItem(name, val);
  },
  remove(name: string) {
    return window.sessionStorage.removeItem(name);
  },
  clear() {
    return window.sessionStorage.clear();
  },
};

export const local = localStorage;
export const session = sessionStorage;
