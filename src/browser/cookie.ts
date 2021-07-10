/**
 * 获取 cookie 所需的 domain
 * @returns 返回当前顶层域名
 * @public
 */
export function getDomain(): string {
  const reg = /^[\d.]*$/;
  const hostname = window.location.hostname;
  return reg.test(hostname) ? '' : hostname.split('.').slice(-2).join('.');
}

/**
 * 存储 cookie
 * @param name - cookie名字
 * @param value - cookie值
 * @param time -  cookie过期时间格式 1970/01/01,
 * @param domain - cookie所在的域，默认为请求的地址
 * @param path - cookie所在的目录，默认为/，就是根目录。
 * @public
 */
export function setCookie(
  name: string,
  value: string,
  time: number,
  domain = getDomain(),
  path = '/'
): void {
  let str = `${name}=${encodeURIComponent(value)}`;
  if (time) {
    const date = new Date(time).toUTCString();
    str += `;expires=${date}`;
  }
  str = domain ? `${str};domain=${domain}` : str;
  str = path ? `${str};path=${path}` : str;
  document.cookie = str;
}
/**
 * 根据 name 获取 cookie 值
 * @param name - cookie name
 * @returns 返回cookie值
 * @public
 */
export function getCookie(name: string): string {
  const cookieStr = document.cookie;
  let end;
  if (cookieStr.length > 0) {
    let start = cookieStr.indexOf(`${name}=`);
    if (start > -1) {
      start += name.length + 1;
      end = cookieStr.indexOf(';', start);
      if (end === -1) {
        end = cookieStr.length;
      }
      return decodeURIComponent(cookieStr.slice(start, end));
    }
  }
  return '';
}
/**
 * 删除 cookie
 * @param name - cookie名
 * @param domain - cookie所在的域，默认为请求的地址
 * @param path - cookie所在的目录，默认为/，就是根目录。
 * @public
 */
export function deleteCookie(name: string, domain = getDomain(), path = '/'): void {
  const date = new Date('1970/01/01');
  let str = `${name}=null;expires=${date.toUTCString()}`;
  str = domain ? `${str};domain=${domain}` : str;
  str = path ? `${str};path=${path}` : str;
  document.cookie = str;
}
