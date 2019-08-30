#!/usr/bin/env node

const { exec } = require('child_process');

// https://stackoverflow.com/questions/56532492/get-version-level-from-npm-script
const npmArgs = JSON.parse(process.env.npm_config_argv);
const part = npmArgs.original[1];

// Temporary solution for
// https://github.com/NativeScript/nativescript-cli/issues/1118
exec(`bumpversion ${part} --allow-dirty`, (error, stdout) => {
    if (error) {
        console.error(error);
    }
});
