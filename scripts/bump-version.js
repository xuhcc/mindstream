#!/usr/bin/env node

const { exec } = require('child_process');
const shell = require('shelljs');

// Temporary solution for
// https://github.com/NativeScript/nativescript-cli/issues/1118
shell.sed(
    '-i',
    new RegExp(process.env.npm_old_version),
    process.env.npm_new_version,
    'App_Resources/iOS/Info.plist',
)
shell.sed(
    '-i',
    new RegExp(process.env.npm_old_version),
    process.env.npm_new_version,
    'src/environments/environment.ts',
)
shell.sed(
    '-i',
    new RegExp(process.env.npm_old_version),
    process.env.npm_new_version,
    'src/environments/environment.prod.ts',
)
