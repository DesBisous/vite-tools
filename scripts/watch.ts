import { watch as rWatch, OutputOptions, RollupOptions } from 'rollup';
import { isDev, logger, watchCode } from './common';

const watchMap = {
  rollupWatch: null,
  gulpWatch: null,
};

/**
 * Rollup 监听
 * @param inputOptions Rollup 输入项
 * @param outOptions Rollup 输出项
 */
export function rollupWatch<T extends RollupOptions>(inputOptions: T, outOptions: OutputOptions): void {
  if (isDev && !watchMap.rollupWatch) {
    const watchOptions = {
      ...inputOptions,
      output: outOptions,
    };
    watchMap.rollupWatch = rWatch(watchOptions);
    watchMap.rollupWatch.on('event', event => {
      logger.info(watchCode[event.code] + `[${typeof inputOptions.input === 'string' ? 'Multiple Chunks' : 'global'}]`);
    });
  }
}
