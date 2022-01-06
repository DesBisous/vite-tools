// rollup 打包
import rollupConfigs from '../../rollup.config';
import { rollup, OutputOptions, RollupOptions } from 'rollup';
import { logger } from '../common';
import { endTime } from '../../gulpfile';
import { rollupWatch } from '../watch';
import { TaskFunc } from './interfaces';

export const buildRollupTask: TaskFunc = async cb => {
  rollupConfigs.forEach(async rollupConfig => {
    const inputOptions = {
      input: rollupConfig.input,
      external: rollupConfig.external,
      plugins: rollupConfig.plugins,
    };
    const outOptions = rollupConfig.output as OutputOptions;
    const bundle = await rollup(inputOptions as RollupOptions);

    // 写入需要遍历输出配置
    if (Array.isArray(outOptions)) {
      outOptions.forEach(async outOption => {
        await bundle.write(outOption);
      });
    }
    // 监听
    rollupWatch(inputOptions as RollupOptions, outOptions);
    endTime();
  });
  cb();
  logger.progress('Rollup 构建成功 ~');
};
