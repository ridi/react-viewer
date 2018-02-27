const git = require('git-rev');
const fs = require('fs-extra');
const webpack = require('webpack');
const npm = require('package-json');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const viewerWebpackConfig = require('./webpack.config.js');
const demoWebpackConfig = require('./demo/webpack.config.js');
const { version, name } = require('./package.json');

const exitWithErrorMsg = (msg) => {
  console.error(msg);
  process.exit(1);
};

const getGitBranch = () => new Promise((resolve, reject) => git.branch(branch => resolve(branch)));
const gitCheckout = branch => exec(`git checkout ${branch}`);
const gitCommitAndPush = commitMsg => exec(`git add . --all && git commit -m ${commitMsg} && git push`);

const checkPreconditions = () => getGitBranch()
  .then(branch => {
    if (branch !== 'master') {
      exitWithErrorMsg('branch must be master');
    }
    return npm(name);
  });

const build = webpackConfig => new Promise((resolve, reject) => {
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(stats);
  });
});

const renameDemoBundleWithVersion = ver =>
  fs.rename('./demo/resources/js/index.js', `./demo/resources/js/${ver}.index.js`)
    .then(() => {
      const bundlesJson = require('./demo/resources/js/bundles.json');
      bundlesJson.bundles.push(`${ver}.index.js`);
      bundlesJson.bundles = [...new Set([...bundlesJson.bundles])];
      bundlesJson.latestVersion = ver;
      return fs.writeJson('./demo/resources/js/bundles.json', bundlesJson);
    });


const args = process.argv.slice(2);
const commands = {
  CHECK_PRECONDITIONS: 'check-preconditions',
  BUILD: 'build',
  RELEASED: 'released',
};

if (args === null || args.length === 0) {
  exitWithErrorMsg('args required for release.js');
}

const execArgs = arg => {
  if (arg === commands.CHECK_PRECONDITIONS) {
    return checkPreconditions();
  } else if (arg === commands.BUILD) {
    return build(viewerWebpackConfig)
      .then(() => build(demoWebpackConfig))
      .then(() => renameDemoBundleWithVersion(version));
  } else if (arg === commands.RELEASED) {
    return gitCheckout('gh-pages')
      .then(() => gitCheckout('master ./demo/index.html'))
      .then(() => gitCheckout('master ./demo/resources/js/'))
      .then(() => gitCheckout('master ./demo/resources/css/'))
      .then(() => gitCheckout('master ./demo/resources/contents/'))
      .then(() => gitCommitAndPush(`Demo version update ${version}`))
      .then(() => gitCheckout('master'));
  }
  return Promise.reject('invalid args');
};

execArgs(args[0])
  .catch(err => exitWithErrorMsg(err));
