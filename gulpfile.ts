import { logger } from './scripts/common';
import { series } from 'gulp';
import { clearLibTask, buildRollupTask, apiExtractorTask, changelogTask } from './scripts/task';

const start = cb => {
  logger.info('✨  Glup 准备就绪 ~');
  cb();
};

const complete = cb => {
  logger.info('✨  Glup 构建完成 ~');
  cb();
  process.exit(); // 结束 node 进程
};

export const changelog = series(start, changelogTask, complete);

// 构建过程
// 1. 删除 lib 文件夹
// 2. rollup 打包
// 3. api-extractor 生成统一的声明文件, 删除多余的声明文件
// 4. 完成
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const build = series(start, clearLibTask, buildRollupTask, apiExtractorTask, complete);
