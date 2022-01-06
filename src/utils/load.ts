import { isInvalid } from './validate';

/* eslint-disable */
export async function loadJS(url: string, key: string, id?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      if (isInvalid(key) && isInvalid(id)) reject(new Error('参数 key 不能为无效值: ' + key));
      if (isInvalid(key) && !isInvalid(id)) key = id;
      const _id = id ?? key;

      if (document.querySelector(`script[id=${_id}]`)) {
        if (window[key]) {
          resolve(window[key]);
          return;
        }

        // 并行执行同个方法处理
        if (!window[key]) {
          let i = 0;
          let time: any = null;
          const getData = () => {
            time = setTimeout(() => {
              i += 1;
              if (window[key]) {
                console.log('执行了' + i + '次获取到数据');
                clearTimeout(time);
                resolve(window[key]);
                return;
              }

              if (i === 5) {
                console.log('数据获取失败');
                clearTimeout(time);
                return;
              }

              getData();
            }, 500);
          };
          getData();
        }
        return;
      }

      const script: any = document.createElement('script');
      script.id = _id;
      // ie
      script.type = 'text/javascript';
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = () => undefined;

            if (window[key]) {
              resolve(window[key] as any);
              return;
            }
            resolve(true);
          }
        };
      } else {
        // 其他浏览器
        script.onload = function () {
          if (window[key]) {
            resolve(window[key] as any);
            return;
          }
          resolve(true);
        };
      }
      script.src = url;
      document.getElementsByTagName('body')[0].appendChild(script);
    } catch {
      reject(new Error('獲取失敗'));
    }
  });
}
