const webpack = require('webpack');

module.exports = {
    plugins: [
        // Allow to specify app port
        new webpack.DefinePlugin({
            PORT: process.env.PORT || 8080,
        }),
    ],
};
