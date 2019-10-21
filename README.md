# Mindstream

[![GitHub release](https://img.shields.io/github/release/xuhcc/mindstream)](https://github.com/xuhcc/mindstream/releases)
[![License: GPL v3](https://img.shields.io/github/license/xuhcc/mindstream)](https://github.com/xuhcc/mindstream/blob/HEAD/LICENSE)

Task management app that uses [todo.txt](http://todotxt.org/) format.

<a href="https://play.google.com/store/apps/details?id=im.mindstream.mobile"><img width="200" alt="Get it on Google Play" src="https://play.google.com/intl/en_gb/badges/images/generic/en_badge_web_generic.png" /></a>

## Features

- Projects, priorities, due dates.
- Recurring tasks.
- Filtering by project, due date.

### Supported todo.txt extensions:

- Tasks with due date: `due:2019-01-01`.
- Recurrent tasks: `rec:1d` (`d` = day, `w` = week, `m` = month).
- Hidden tasks: `h:1`.

<img src="metadata/en-US/images/phoneScreenshots/screenshot_tasks.png" width="360"> <img src="metadata/en-US/images/phoneScreenshots/screenshot_add_task.png" width="360">

## Changelog

See [CHANGELOG](CHANGELOG.md).

## Development

Prerequisites:

* Node.js & NPM
* [NativeScript CLI](https://docs.nativescript.org/angular/start/quick-setup#step-2-install-the-nativescript-cli) 6.1

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
