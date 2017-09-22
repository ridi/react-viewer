const fs = require('fs-extra');
const webpack = require('webpack');
const process = require('child_process');
const git = require('git-rev');
const npm = require('package-json');
const viewerWebpackConfig = require('./webpack.config.js');
const demoWebpackConfig = require('./demo/webpack.config.js');
const { version, name } = require('./package.json');


const exec = cmd => new Promise((resolve, reject) => {
  process.exec(cmd, (err, stdout, stderr) => {
    if (err) {
      reject(err);
      return;
    }
    resolve();
  });
});

const getGitBranch = () => new Promise((resolve, reject) => git.branch(branch => resolve(branch)));
const getGitTag = () => new Promise((resolve, reject) => git.tag(tag => resolve(tag)));

const checkPreconditions = () => getGitBranch()
  .then(branch => {
    if (branch !== 'master') {
      throw new Error('branch must be master');
    }
    return getGitTag();
  })
  .then(tag => {
    if (tag.replace('v', '') !== version) {
      throw new Error('version and git tag is not equals');
    }
    return npm(name);
  })
  .then(packageInfo => {
    if (version === packageInfo.version) {
      throw new Error(`version ${version} already published`);
    }
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
      bundlesJson.latestVersion = ver;
      return fs.writeJson('./demo/resources/js/bundles.json', bundlesJson);
    });

const npmPublish = () => exec('npm publish');

const gitCheckout = branch => exec(`git checkout ${branch}`);

const gitCommitAndPush = commitMsg => exec(`git add . --all && git commit -m ${commitMsg} && git push`);


checkPreconditions()
  .then(() => {
    console.log('building viewer...');
    return build(viewerWebpackConfig);
  })
  .then(() => {
    console.log('building demo...');
    return build(demoWebpackConfig);
  })
  .then(() => gitCommitAndPush('"bundle update"'))
  .then(() => renameDemoBundleWithVersion(version))
  .then(() => {
    console.log('npm publish...');
    return npmPublish();
  })
  .then(() => {
    console.log('prepare gh-pages...');
    return gitCheckout('gh-pages');
  })
  .then(() => gitCheckout('master ./demo/index.html'))
  .then(() => gitCheckout('master ./demo/resources/js/*'))
  .then(() => gitCommitAndPush(`version update ${version}`))
  .then(() => gitCheckout('master'))
  .catch(err => console.error(err));
