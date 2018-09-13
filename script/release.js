const git = require('git-rev');
const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const viewerWebpackConfig = require('../webpack.config.js');
const demoWebpackConfig = require('../demo/webpack.config.js');
const { version } = require('../package.json');

const exitWithErrorMsg = (msg) => {
  console.error(msg);
  process.exit(1);
};

const args = process.argv.slice(2);
const commands = {
  CHECK_PRECONDITIONS: 'check-preconditions',
  BUILD: 'build',
  RELEASED: 'released',
};

if (args === null || args.length === 0) {
  exitWithErrorMsg('args required for release.js');
}

const getGitBranch = () => new Promise(resolve => git.branch(branch => resolve(branch)));
const gitAddAll = () => exec('git add .');
const gitCheckout = branch => exec(`git checkout ${branch}`);
const gitCommitAndPush = (commitMsg, branch) => exec(`git add . --all && git commit -m ${commitMsg} && git push origin ${branch}`);
const pathDemo = p => path.resolve(__dirname, '../demo', p);


const build = webpackConfig => new Promise((resolve, reject) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      reject(err.stack || err);
      if (err.details) {
        reject(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      reject(info.errors);
      return;
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }
    resolve();
  });
});

const renameDemoBundleWithVersion = ver =>
  fs.copy(pathDemo('resources/js/index.js'), pathDemo(`resources/js/${ver}.index.js`))
    .then(() => {
      const bundlesJson = require(pathDemo('resources/js/bundles.json'));
      bundlesJson.bundles.push(`${ver}.index.js`);
      bundlesJson.bundles = [...new Set([...bundlesJson.bundles])];
      bundlesJson.latestVersion = ver;
      return fs.writeJson(pathDemo('resources/js/bundles.json'), bundlesJson);
    });

const execArgs = (arg) => {
  if (arg === commands.BUILD) {
    return build(viewerWebpackConfig)
      .then(() => build(demoWebpackConfig))
      .then(() => renameDemoBundleWithVersion(version))
      .then(() => gitAddAll());
  } else if (arg === commands.RELEASED) {
    return getGitBranch().then(branch => gitCheckout('gh-pages')
      .then(() => gitCheckout(`${branch} ${pathDemo('index.html')}`))
      .then(() => gitCheckout(`${branch} ${pathDemo('resources/js/')}`))
      .then(() => gitCheckout(`${branch} ${pathDemo('resources/css/')}`))
      .then(() => gitCheckout(`${branch} ${pathDemo('resources/fonts/')}`))
      .then(() => gitCheckout(`${branch} ${pathDemo('resources/contents/')}`))
      .then(() => gitCommitAndPush(`"Demo version update ${version}"`, 'gh-pages'))
      .then(() => gitCheckout(`${branch}`)));
  }
  return Promise.reject(new Error('invalid args'));
};

execArgs(args[0]).catch(err => exitWithErrorMsg(err));
