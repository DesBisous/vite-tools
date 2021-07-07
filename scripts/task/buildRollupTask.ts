// rollup 打包
import rollupConfig from '../../rollup.config';
import { rollup, watch } from 'rollup';
import { isDev, logger, watchCode } from '../common';
import { OutputOptions } from 'rollup';
import { TaskFunc } from './interfaces';

export const buildRollupTask: TaskFunc = async cb => {
  const inputOptions = {
    input: rollupConfig.input,
    external: rollupConfig.external,
    plugins: rollupConfig.plugins,
  };
  const outOptions = rollupConfig.output as OutputOptions;
  const bundle = await rollup(inputOptions);

  // 写入需要遍历输出配置
  if (Array.isArray(outOptions)) {
    outOptions.forEach(async outOption => {
      await bundle.write(outOption);
    });
    cb();
    logger.progress('Rollup 构建成功');
  }

  if (isDev) {
    const watchOptions = {
      ...inputOptions,
      output: outOptions,
    };
    const watcher = watch(watchOptions);
    watcher.on('event', event => {
      logger.info(watchCode[event.code]);
    });
  }
};
