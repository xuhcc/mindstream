const webpack = require('webpack');

module.exports = {
    plugins: [
        // Provide global variable for jstodotxt
        new webpack.ProvidePlugin({
            TodoTxtExtension: ['jstodotxt/jsTodoExtensions', 'TodoTxtExtension'],
        }),
    ],
};
