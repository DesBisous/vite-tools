import path from 'path';
import chalk from 'chalk';

export const isDev = process.env.NODE_ENV !== 'production';

export const watchCode = {
  START: '监听器正在启动（重启）',
  BUNDLE_START: '构建单个文件束',
  BUNDLE_END: '完成文件束构建',
  END: '完成所有文件束构建',
  ERROR: '构建时遇到错误',
  FATAL: '遇到无可修复的错误',
};

const format = (label: string, msg: string) => {
  return msg
    .split('\n')
    .map((line, i) => {
      return i === 0 ? `${label} ${line}` : line.padStart(label.length + line.length + 1);
    })
    .join('\n');
};

const chalkTag = (msg: string): string => chalk.bgBlackBright.white.dim(` ${msg} `);

export const paths = {
  root: path.join(__dirname, '../'),
  lib: path.join(__dirname, '../lib'),
  apiExtractorJsonPath: path.join(__dirname, '../api-extractor.json'),
  CHANGELOG: path.join(__dirname, '../CHANGELOG.md'),
};

export const logger = {
  log: (msg = '', tag = null): void => {
    tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
  },
  progress: (msg = '', tag = null): void => {
    console.log(format(chalk.bgGreen.black(' PROGRESS ') + (tag ? chalkTag(tag) : ''), msg));
  },
  info: (msg = '', tag = null): void => {
    console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
  },
  done: (msg = '', tag = null): void => {
    console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
  },
  warn: (msg = '', tag = null): void => {
    console.warn(
      format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg))
    );
  },
  error: (msg = '', tag = null): void => {
    console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)));
  },
};

/**
 * 等待函数
 */
export const wait = async (timeSpan = 600): Promise<unknown> => {
  return new Promise(resolve => {
    setTimeout(resolve, timeSpan);
  });
};

export default {};
