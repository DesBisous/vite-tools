import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import { ExtractorConfig, ExtractorResult, Extractor } from '@microsoft/api-extractor';
import { paths, logger, isDev, wait } from '../common';
import { TaskFunc } from './interfaces';

// api-extractor 整理 .d.ts 文件
export const apiExtractorTask: TaskFunc = async cb => {
  if (isDev) {
    cb();
    return;
  }
  await wait(5000); // 增加 2s 中等待 Rollup 构建完成
  const apiExtractorJsonPath: string = paths.apiExtractorJsonPath;
  // 加载并解析 api-extractor.json 文件
  const extractorConfig: ExtractorConfig = await ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);
  // 判断是否存在 index.d.ts 文件，这里必须异步先访问一边，不然后面找不到会报错
  const isExist: boolean = await fse.pathExists(extractorConfig.mainEntryPointFilePath);

  if (!isExist) {
    logger.error('API Extractor 没找到入口文件: index.d.ts');
    return;
  }

  // 调用 API
  const extractorResult: ExtractorResult = await Extractor.invoke(extractorConfig, {
    localBuild: false,
    // 在输出中显示信息
    showVerboseMessages: false,
  });

  if (extractorResult.succeeded) {
    // 删除多余的 .d.ts 文件
    const libFiles: string[] = await fse.readdir(paths.lib);
    libFiles.forEach(async file => {
      const filePath = path.join(paths.lib, file);
      if (!file.includes('index')) {
        if (file.endsWith('.d.ts')) await fse.remove(filePath);
        if (fs.statSync(filePath).isDirectory()) await fse.remove(filePath);
      }
    });
    logger.progress('API Extractor 成功处理完成 ~');
    cb();
  } else {
    logger.error(
      `API Extractor 工作中出现 ${extractorResult.errorCount} Errors` + ` 和 ${extractorResult.warningCount} Warnings`
    );
  }
};
