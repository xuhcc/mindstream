# Mindstream

[![GitHub release](https://img.shields.io/github/release/xuhcc/mindstream)](https://github.com/xuhcc/mindstream/releases)
[![License: GPL v3](https://img.shields.io/github/license/xuhcc/mindstream)](https://github.com/xuhcc/mindstream/blob/HEAD/LICENSE)

Task management app that uses [todo.txt](http://todotxt.org/) format.

<a href="https://play.google.com/store/apps/details?id=im.mindstream.mobile"><img width="200" alt="Get it on Google Play" src="https://play.google.com/intl/en_gb/badges/images/generic/en_badge_web_generic.png" /></a>

## Features

- Projects, contexts, priorities, due dates.
- Recurring tasks.
- Filtering by project, context or due date.
- Sorting by due date or priority.
- Markdown support.

### Supported todo.txt extensions

- Tasks with due date: `due:2019-01-01`.
- Recurrent tasks: `rec:1d` (`d` = day, `w` = week, `m` = month, `y` = year).
- Colored tasks: `color:#e9dce5`.
- Hidden tasks: `h:1`.

See [example](metadata/todo.txt).

<img src="metadata/en-US/images/phoneScreenshots/screenshot_tasks.png" width="360"> <img src="metadata/en-US/images/phoneScreenshots/screenshot_add_task.png" width="360">

## Changelog

See [CHANGELOG](CHANGELOG.md).

## Usage

### Android

Android app can be installed from [Google Play](https://play.google.com/store/apps/details?id=im.mindstream.mobile).

Alternatively, latest APK can be downloaded from [releases page](https://github.com/xuhcc/mindstream/releases).

### iOS (unmaintained)

Build unsigned iOS package from source (only on MacOS):

```
npm install
npm run ios-unsigned
```

### Web

Build from source:

```
npm install
npm run web-release
```

Run the web app (it will be available at `http://localhost:8080/`):

```
cd platforms/web/
PORT=8080 node index.js
```

## Development

Prerequisites:

* Node.js & NPM
* [NativeScript CLI](https://v7.docs.nativescript.org/angular/start/quick-setup#step-2-install-the-nativescript-cli) 7.0

Install required packages:

```
npm install
```

### Mobile

Run in Android emulator:

```
npm run android
```

Run in iOS emulator:

```
npm run ios
```

### Web

Run in browser:

```
npm start
```

### Testing

```
npm run lint
npm run test
```

## License

[GPL v3](LICENSE)
