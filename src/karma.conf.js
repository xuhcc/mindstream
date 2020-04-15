module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-jsdom-launcher'),
            require('karma-mocha-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['jsdom'],
        singleRun: true,
    })
}
