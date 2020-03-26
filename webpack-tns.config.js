const webpack = require('webpack');
const baseConfig = require('./webpack.config');

module.exports = env => {
    const config = baseConfig(env);
    config.plugins.push(
        // Provide global variable for jstodotxt
        new webpack.ProvidePlugin({
            TodoTxtExtension: ['jstodotxt/jsTodoExtensions', 'TodoTxtExtension'],
        }),
    );
    return config;
};
