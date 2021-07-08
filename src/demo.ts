/**
 * 1 + 1
 * @returns 2
 * @example
 * ```ts
 * add() => 2
 * ```
 * @beta
 */
export const add = (): number => 1 + 1;

/**
 * myFirstFunc
 * @param str - str string
 * @returns `hello Str`
 * @public
 */
export default function myFirstFunc(str: string): string {
  return `hello ${str}`;
}
