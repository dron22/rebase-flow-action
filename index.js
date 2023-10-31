const core = require('@actions/core');
const exec = require('@actions/exec');


async function run() {
  try {
    const targetBranch = core.getInput('target-branch');
    
    // fetch target branch commits
    const targetBranchFullPath = `remotes/origin/${targetBranch}`
    const commitsMainOutput = await executeFunction('git', ['rev-list', '--first-parent', targetBranchFullPath]);
    const commitsMain = commitsMainOutput.split('\n');

    // fetch current branch commits
    const commitsCurrentOutput = await executeFunction('git', ['rev-list', '--first-parent', 'HEAD']);
    const commitsCurrent = commitsCurrentOutput.split('\n');

    // compare oldest ancestor and head of target
    const oldestAncestor = commitsMain.filter(x => commitsCurrent.includes(x))[0];
    const headOfMain = await executeFunction('git', ['rev-parse', targetBranchFullPath]);

    if (oldestAncestor !== headOfMain) {
      const currentBanch = await executeFunction('git', ['branch']);
      core.setFailed(`Current branch '${currentBanch}' needs to be rebased on target branch '${targetBranch}'`);
    }
  } catch (error) {
    core.setFailed(`unexpected error: ${error.message}`);
  }
}

const executeFunction = async(cmd, options) => {
    let output = '';

    const execOptions = {};
    execOptions.listeners = {
      stdout: (data) => {
        output += data.toString();
      },
    };

    await exec.exec(cmd, options, execOptions);

    return output.replace(/^[ *\s]+|[ \s]+$/g, '');
};

run();
