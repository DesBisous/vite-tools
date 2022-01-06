import { wait } from '../../src/utils/async';

describe('async:', () => {
  test('test: wait', async () => {
    expect.assertions(1);
    const timeSpan = 4000;
    const startTime = Date.now();
    await wait(timeSpan);
    const endTime = Date.now();
    expect(endTime - startTime).toBeWithinRange(timeSpan - 100, timeSpan + 100);
  });
});
