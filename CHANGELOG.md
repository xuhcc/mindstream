# Changelog

## 1.6.0

- Android: Created todo.txt file in user-accessible location.
- Android: Made text on plaintext page selectable.

## 1.5.0

- Mobile, Web: Upgraded to NativeScript 7.0.
- Mobile, Web: Added backslash trick to usage tips.
- Mobile, Web: Redirecting to welcome page if file is not set.
- Web: Enabled autocomplete in todo file path field.

## 1.4.0

- Mobile, Web: Allowed more recurrence options (#6 by @oli-ver).
- Mobile: Enabled horizontal scrolling on plain text page.

## 1.3.2

- Android: Fixed filesystem access errors on Android 10.

## 1.3.1

- Web: Added recurrence picker to task form.
- Android: Fixed file-picking from 'SDCARD' location.
- Android: Showing error message when file picker can't retrieve the file path.
- iOS: Fixed wrong background color on 'About' page.

## 1.3.0

- Mobile, Web: Added usage tips to 'About' page.
- Mobile, Web: Disabled auto-focusing on text field when editing a task.
- Mobile: Notifying of file access errors with a toast.
- iOS: Fixed wrong behaviour of menu button on 'About' page.

## 1.2.0

- Mobile, Web: Renamed 'Projects' page to 'Tags', added contexts to it.
- Mobile, Web: Not showing empty task when creating new todo.txt file.
- Mobile, Web: Sorting tasks by project first, then by context.
- Mobile, Web: Added support for 'color' extension.
- Mobile, Web: Fixed parsing of task text on update.
- Mobile, Web: Filling 'contexts' field on task form from current filter.
- Mobile, Web: Not showing an empty task if todo.txt file ends with a newline.

## 1.1.0

- Mobile, Web: Added 'About' page.
- Mobile, Web: Added shortcut for priority D to task form.
- Mobile, Web: Enabled autocompletion for contexts.
- Mobile, Web: Trimming whitespace from projects and contexts in task form.
- Mobile, Web: Showing current due date in calendar when editing task.
- Mobile, Web: Fixed task postponement bug.
- Mobile: Added 'tomorrow' shortcut to due date field.
- Mobile: Enabled switching between tasks and projects with swipe gesture.
- Mobile: Moved 'save' button to action bar at task form page.
- Android: Moving cursor to the end of line when removing item from autocomplete field.
- Web: Added Alt+A hotkey for adding new task.
- Web: Allowed to submit task form by pressing 'Enter'.
- Web: Allowed to close task form by pressing 'Esc'.
- Web: Showing app version in navigation bar.
- Web: Fixed switching with 'Tab' between projects and contexts in task form.
- Web: Allowed to postpone task by ctrl-clicking on checkbox.

## 1.0.0

- Mobile, Web: Added priority selection buttons to task form.
- Mobile, Web: Added support for contexts.
- Mobile, Web: Fixed project search bug at task form.
- Mobile, Web: Fixed bug where task IDs become wrong.
- Mobile, Web: Fixed 'hidden' extension.
- Web: Created plaintext page.
- Web: Added task sorting dialog.
- Web: Added task menu.
- Web: Allowed text selection in task list.
- Web: Enabled project suggestions in task form.
- Web: Allowed to select project with keyboard.
- Web: Fixed error on app reloading.
- Web: Added 'tomorrow' button to task form.
- Web: Added datepicker to task form.

## 0.6.0

- Mobile: Enabled automatic reloading of todo.txt file on changes.
- Mobile: Added ability to sort tasks by due date and priority.
- IOS: Fixed incorrect size of action bar icons.
- Web: Created task list, task form and project list.

## 0.5.0

- Allowed to add mutiple projects to task.
- Fixed bug in task removal.
- Added support for hidden tasks.
- Prevented opening of task form after tapping on link in Android app.
- Enabled long-tap text selection on Android.
- Changed project list design.
- Show task menu after long press on checkbox.

## 0.4.2

- Fixed bug where monthly tasks were not completed properly.
- Improved app performance.

## 0.4.1

- Removed camera and microphone permission requirements.

## 0.4.0

- Added welcome screen.
- Use current project filter to prefill project field in task form.
- Change app icon on iOS.
- Render task text as markdown.
- Enabled coloring of due date tag, similar to priorities.
- Changed datepicker type to calendar on Android.

## 0.3.0

- Initial release.
