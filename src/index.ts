import * as core from '@actions/core';
import { config } from './config';
import { logGithubWorkflows } from './github';
import { delay, poll } from './time';

async function main(): Promise<void> {
  const { initial_delay, timeout, interval } = config();
  try {
    await delay(initial_delay);
    await poll({ timeout, interval }, logGithubWorkflows);
    core.info('👌 Previous Github workflows completed. Resuming...');
  } catch (e: unknown) {
    core.setFailed(((e as Error)?.message as string) || '😿 Action failed');
    return;
  }
  return;
}

main();
