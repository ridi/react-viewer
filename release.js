const git = require('git-rev');
const npm = require('package-json');
const { version, name } = require('./package.json');

const exitWithErrorMsg = msg => {
  console.error(msg);
  process.exit(1);
};

const getGitBranch = () => new Promise((resolve, reject) => git.branch(branch => resolve(branch)));

const checkPreconditions = () => getGitBranch()
  .then(branch => {
    if (branch !== 'master') {
      exitWithErrorMsg('branch must be master');
    }
  })
  .then(packageInfo => {
    if (version === packageInfo.version) {
      exitWithErrorMsg(`version ${version} already published`);
    }
  });


const args = process.argv.slice(2);
const commands = {
  CHECK_PRECONDITIONS: 'check-preconditions',
};

if (args == null || args.length === 0) {
  exitWithErrorMsg('args required for release.js');
}

if (args[0] === commands.CHECK_PRECONDITIONS) {
  checkPreconditions();
}
