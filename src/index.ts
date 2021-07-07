export * from './add';
export * from './hello';

/**
 * myFirstFunc
 * @param str - str string
 * @returns `hello Str`
 * @public
 */
export default function myFirstFunc(str: string): string {
  return `hello ${str}`;
}
