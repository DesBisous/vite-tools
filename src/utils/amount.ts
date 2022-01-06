/**
 * 千分位格式化
 * @param value - 金额
 * @returns 千分位格式化后的字符串
 * @public
 */
export function thousandFormatter(value: string | number): string {
  return value.toString().replace(/\d+/, n => n.replace(/(\d)(?=(\d{3})+$)/g, $1 => $1 + ','));
}
