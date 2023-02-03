# Wait for workflows Github Action

[![Build status](https://github.com/ygqygq2/workflow-wait-action/actions/workflows/build.yml/badge.svg)](https://github.com/ygqygq2/workflow-wait-action/actions/workflows/build.yml)

A GitHub Action that waits for workflows in progress to complete before resuming and running a parent workflow.

## Scenarios of use

- monorepo: a workflow needs to wait for multiple other workflows to complete
- deploy or run e2e tests once: run a deployment + e2e workflow only after multiple build + unit test workflows are successfully completed

## Can I do this with Github already?

Out of the box, Github does not seem to provide a way to only run a workflow **once**, after other workflows are completed.

The default behavior of the native `workflow_run` [event trigger](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_run) is to:

- not wait for all dependent workflows to complete to trigger the workflow
- trigger the workflow multiple times (for each completed/dependent workflow)

The `workflow_run` event will also only trigger a workflow run if the workflow file is on the default branch, typically `master` or `main`.

## Usage

The following examples show how to configure a workflow named `workflow-last`.

`workflow-last` will wait for any other workflows (triggered in the same branch) to complete and then resume its own steps.

### Simple example

```yaml
name: workflow-last

jobs:
  always_last:
    steps:
      - name: Pause until all workflows are completed
        uses: ygqygq2/workflow-wait-action@v1

      - name: Resume and run once, after all workflows are completed
        run: date
```

### Example with options

```yaml
name: workflow-last

jobs:
  always_last:
    steps:
      - name: Pause until all workflows are completed
        uses: ygqygq2/workflow-wait-action@v1
        with:
          access_token: ${{ secrets.GITHUB_TOKEN }}
          timeout: 600
          interval: 10
          initial_delay: 0
          associated_workflows: false

      - name: Resume and run once, after all workflows are completed
        run: date
```

## Options

| Syntax        | Description                                                                                                              | Mandatory? | Default value        | Example value                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------- | -------------------- | --------------------------------- |
| access_token  | Your GitHub Access Token                                                                                                 | No         | `{{ github.token }}` |                                   |
| timeout       | Action timeout. If in-progress workflows are not completed within the timeout period, the Action will fails the workflow | No         | 600                  |                                   |
| interval      | Interval used to poll the status of the workflows                                                                        | No         | 10                   |                                   |
| initial_delay | Initial delay used to give minimal time to all workflows to be queued & started                                          | No         | 0                    |                                   |
| associated_workflows| Wait workflow runs that are associated with the head_sha. If set to true, the action will wait for all workflows that are associated with this workflow with the same head_sha     |  No | false  |  |
| workflows     | List of workflows to wait for. Must be a multiline string using                                                          | No         | ''                   | \| <br/>workflow-1<br/>workflow-2 |

## Limitations

Given the following workflows:

- `workflow-1` (takes 5 minutes)
- `workflow-2` (takes 45 minutes)
- `workflow-last` (configured to pause until `workflow-1` and `workflow-2` are completed, takes 10m)

`workflow-last` will at minimum use 55 minutes/month (= 45 + 10 minutes) of your Github CI plan due to all workflows effectively starting at the same time.
