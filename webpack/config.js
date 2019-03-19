const path = require('path');
const { argv } = require('yargs');
const rootPath = process.cwd();

const isWatcher = !!((argv.env && argv.env.watcher) || argv.p);

const config = {
    paths: {
        context: path.join(rootPath,'src')
    },
    entry: {
      app: './index.js'
    },
    enabled: {
        watcher: isWatcher
    },
    cacheBusting: "[name]_[hash:8]",
    publicPath: "/dist/",
};

module.exports = config;
