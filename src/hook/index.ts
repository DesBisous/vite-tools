import { setupAjaxHook, setJSBridge } from './ajax/vAjaxHook';
import { setupFormHook } from './form/vFormHook';

export function init() {
  setJSBridge();
  setupFormHook();
  setupAjaxHook();
}
init();
