import fse from 'fs-extra';
import conventionalChangelog from 'conventional-changelog';
import { paths } from '../common';
import { TaskFunc } from './interfaces';

// 自定义生成 changelog
export const changelogTask: TaskFunc = async cb => {
  const changelogPath: string = paths.CHANGELOG;
  // 对命令 conventional-changelog -p angular -i CHANGELOG.md -w -r 0
  const changelogPipe = await conventionalChangelog({
    preset: 'angular',
    releaseCount: 0,
  });

  changelogPipe.setEncoding('utf8');

  const resultArray = ['# 工具库更新日志\n\n'];
  changelogPipe.on('data', chunk => {
    // 原来的 commits 路径是进入提交列表
    chunk = chunk.replace(/\/commits\//g, '/commit/');
    resultArray.push(chunk);
  });
  changelogPipe.on('end', async () => {
    await fse.createWriteStream(changelogPath).write(resultArray.join(''));
    cb();
  });
};
