import { getInput, info as core_info } from '@actions/core';

interface ActionConfig {
  timeout: number;
  interval: number;
  initial_delay: number;
  associated_workflows: boolean;
}

const oneSecond = 1000;

 
enum ActionStatus {
  WORKFLOWS_AWAITED_OK = 'workflows_awaited_ok',
  TIMEOUT_EXCEEDED = 'action_timeout_exceeded',
}

const config = (): ActionConfig => {
  const actionConfig = {
    timeout: parseInt(getInput('timeout')) || 600,
    interval: parseInt(getInput('interval')) || 10,
    initial_delay: parseInt(getInput('initial_delay')) || 0,
    associated_workflows: getInput('associated_workflows') === 'true' || false,
  };

  const info = [
    `Action configuration:`,
    `${actionConfig.initial_delay}s initial delay,`,
    `${actionConfig.interval}s interval,`,
    `${actionConfig.timeout}s timeout`,
    `Associated workflows: ${actionConfig.associated_workflows}`,
  ];
  core_info(info.join(' '));
  core_info('');

  return actionConfig;
};

export { oneSecond, ActionStatus, config };
