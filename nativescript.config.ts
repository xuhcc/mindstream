import { NativeScriptConfig } from '@nativescript/core'

export default {
    id: 'im.mindstream.mobile',
    appResourcesPath: 'App_Resources',
    android: {
        v8Flags: '--expose_gc',
        markingMode: 'none',
        codeCache: true,
    },
    appPath: 'src',
    nsext: '.tns',
    webext: '',
    shared: true,
    webpackConfigPath: 'webpack-tns.config.js',
} as NativeScriptConfig
