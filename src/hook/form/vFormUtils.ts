import { FormDataFile } from '../../interfaces';

/**
 * 遍历表单记录
 */
export function traversalEntries(formData: any, traversal?: (key: string, value: any, fileName?: string) => void) {
  let values = [];
  if (formData._entries) values = formData._entries;
  else values = Array.from(formData.entries());
  for (const pair of values) {
    const key: string = pair[0];
    const value: any = pair[1];
    const fileName = pair.length > 2 ? pair[2] : null;

    if (traversal) {
      traversal(key, value, fileName);
    }
  }
}

/**
 * 转换表单单条记录到一个数组对象
 * @param key
 * @param value
 * @param fileName
 */
export function convertSingleFormDataRecordToArray(key: string, value: any, fileName?: string): Promise<Array<any>> {
  return new Promise<Array<any>>((resolve, reject) => {
    const singleKeyValue: Array<any> = [];
    singleKeyValue.push(key);
    if (value instanceof File || value instanceof Blob) {
      // 针对文件特殊处理
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(value);
      reader.onload = function (this: FileReader, ev: ProgressEvent) {
        const base64: string = (ev.target as any).result;
        const formDataFile: FormDataFile = {
          name: fileName ? fileName : value instanceof File ? (value as File).name : '',
          lastModified: value instanceof File ? (value as File).lastModified : 0,
          size: value.size,
          type: value.type,
          data: base64,
        };
        singleKeyValue.push(formDataFile);
        resolve(singleKeyValue);
        return null;
      };
      reader.onerror = function (this: FileReader, ev: ProgressEvent) {
        reject(Error('formdata 表单读取文件数据失败' + JSON.stringify(ev)));
        return null;
      };
    } else {
      singleKeyValue.push(value);
      resolve(singleKeyValue);
    }
  });
}
