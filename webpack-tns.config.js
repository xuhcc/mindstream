const webpack = require('webpack');
const baseConfig = require('./webpack.config');

module.exports = env => {
    const config = baseConfig(env);
    return config;
};
