const fs   = require('fs-extra'),
      path = require('path'),
      config = require('./config.js');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    resolveApp : path => resolveApp(path),
    appPublic  : resolveApp( config.appPublic ),
    appBuild   : resolveApp( config.appBuild ),
    appHtml    : resolveApp( config.appHtml ),
    appIndexJs : resolveApp( config.appIndexJs )
};