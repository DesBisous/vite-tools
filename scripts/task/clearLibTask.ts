import fse from 'fs-extra';
import { paths, logger } from '../common';
import { TaskFunc } from './interfaces';

// 删除 lib 文件
export const clearLibTask: TaskFunc = async cb => {
  fse.removeSync(paths.lib);
  logger.progress('删除构建包完毕 ~');
  cb();
};
