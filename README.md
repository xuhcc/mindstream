# Mindstream

[![License: GPL v3](https://img.shields.io/github/license/xuhcc/beancount-mobile)](https://github.com/xuhcc/beancount-mobile/blob/HEAD/LICENSE)

Task management app that uses [todo.txt](http://todotxt.org/) format.

<a href="https://play.google.com/store/apps/details?id=im.mindstream.mobile"><img width="200" alt="Get it on Google Play" src="https://play.google.com/intl/en_gb/badges/images/generic/en_badge_web_generic.png" /></a>

Features:

- Projects, priorities, due dates.
- Recurring tasks.
- Filtering by project, due date.

<img src="metadata/en-US/images/phoneScreenshots/screenshot_tasks.png" width="360"> <img src="metadata/en-US/images/phoneScreenshots/screenshot_add_task.png" width="360">

## Changelog

See [CHANGELOG](CHANGELOG.md).

## Development

Prerequisites:

* Node.js & NPM
* [NativeScript CLI](https://docs.nativescript.org/angular/start/quick-setup#step-2-install-the-nativescript-cli) 6.0

Install required packages:

```
npm install
```

### Mobile

Run in android emulator:

```
npm run android
```

Run in iOS emulator:

```
npm run ios
```

### Testing

```
npm run lint
npm run test
```

## License

[GPL v3](LICENSE)
