#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const FONT_FIR = 'src/fonts';
const FONTS = [
    'node_modules/material-design-icons-iconfont/dist/fonts/MaterialIcons-Regular.ttf',
    'node_modules/@openfonts/vollkorn_all/files/vollkorn-all-400.woff2',
    'node_modules/@openfonts/vollkorn_all/files/vollkorn-all-400-italic.woff2',
    'node_modules/@openfonts/vollkorn_all/files/vollkorn-all-700.woff2',
    'node_modules/@openfonts/pt-sans_all/files/pt-sans-all-400.woff2',
    'node_modules/@openfonts/pt-sans_all/files/pt-sans-all-700.woff2',
];

if (!fs.existsSync(FONT_FIR)){
    fs.mkdirSync(FONT_FIR);
}

FONTS.forEach((filePath) => {
    let fileName = path.basename(filePath);
    fs.copyFile(filePath, path.join(FONT_FIR, fileName), (error) => {
        if (error) {
            throw error;
        } else {
            console.info(`copied font ${fileName}`);
        }
    });
});
