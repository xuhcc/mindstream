const webpack = require('webpack');

module.exports = {
    plugins: [
        // Provide global variable for jstodotxt
        new webpack.ProvidePlugin({
            TodoTxtExtension: ['jstodotxt/jsTodoExtensions', 'TodoTxtExtension'],
        }),
        // Allow to specify app port
        new webpack.DefinePlugin({
            PORT: process.env.PORT || 8080,
        }),
    ],
};
