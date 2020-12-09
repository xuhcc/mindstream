import { Component, OnInit, OnDestroy, ViewContainerRef, ElementRef, ViewChild } from '@angular/core'
import { formatDate } from '@angular/common'

import * as MarkdownIt from 'markdown-it'
import * as mila from 'markdown-it-link-attributes'
import { Subscription } from 'rxjs'
import { firstBy } from 'thenby'

import { SideDrawerService } from '../nav/sidedrawer.service'
import { DialogService } from '../shared/dialog.service'
import { RouterService } from '../shared/router.service'
import { TaskFilter } from '../shared/settings'
import { SettingsService } from '../shared/settings.service'
import { TodoFileService } from '../shared/todo-file.service'
import { Task, DateType, getDateType } from '../shared/task'
import { compareEmptyGreater } from '../shared/misc'
import { onNavigatedTo, onNavigatingFrom } from '../shared/helpers/page'
import { isAndroid, isIOS, isWeb } from '../shared/helpers/platform'
import { onPullRefresh } from '../shared/helpers/pullrefresh'

function taskListId(list: Task[]): string {
    return JSON.stringify(list.map((task) => task.todoItem.toString()))
}

@Component({
    selector: 'ms-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit, OnDestroy {

    tasks: Task[] = [];
    filter: TaskFilter = {};
    ordering: string[];
    private filteredTasks: Task[] = []

    private fileSubscription: Subscription;
    private markdown = new MarkdownIt({linkify: true})
        .use(mila, {
            attrs: {
                target: '_blank',
                rel: 'noopener',
            },
        })

    @ViewChild('taskList', {static: false})
    taskList: ElementRef;

    constructor(
        private dialog: DialogService,
        private router: RouterService,
        private settings: SettingsService,
        private todoFile: TodoFileService,
        private sideDrawer: SideDrawerService,
        private view: ViewContainerRef,
    ) { }

    ngOnInit() {
        this.filter = this.settings.filter
        this.ordering = this.settings.ordering
        if (this.ordering.length === 0) {
            this.ordering = ['due', 'priority']
        }
        this.todoFile.fileLoaded.then(() => this.createTaskList())
        // Workarounds for NS
        // ngOnInit is not called after back-navigation
        // ngOnDestroy is not called before navigation
        // https://github.com/NativeScript/nativescript-angular/issues/1049
        onNavigatedTo(this.view, () => {
            this.fileSubscribe()
        })
        onNavigatingFrom(this.view, () => {
            this.fileUnsubscribe()
        })
    }

    ngOnDestroy() {
        this.fileUnsubscribe()
    }

    private getSorter(): any {
        let sorter = firstBy('complete') as any
        this.ordering.forEach((field: string) => {
            sorter = sorter.thenBy(field, {cmp: compareEmptyGreater})
        })
        sorter = sorter.thenBy('projects').thenBy('contexts')
        return sorter
    }

    private createTaskList() {
        this.tasks = this.todoFile.getTasks()
        // Sort tasks
        this.tasks.sort(this.getSorter())
    }

    private fileSubscribe() {
        this.fileSubscription = this.todoFile.fileChanged.subscribe((reload: boolean) => {
            if (!reload) {
                return
            }
            this.createTaskList()
        })
    }

    private fileUnsubscribe() {
        this.fileSubscription.unsubscribe()
    }

    reloadFile(event: any) {
        onPullRefresh(event, () => {
            this.todoFile.load()
        })
    }

    getDateDisplay(date: Date): string {
        const dateType = getDateType(date)
        if (dateType === DateType.Today) {
            return 'today'
        } else if (dateType === DateType.Tomorrow) {
            return 'tomorrow'
        } else {
            return formatDate(date, 'dd.MM.yyyy', 'en-US')
        }
    }

    get title(): string {
        if (this.filter.project) {
            return `Tasks: ${this.filter.project}`
        }
        if (this.filter.context) {
            return `Tasks: ${this.filter.context}`
        }
        if (this.filter.dueDate) {
            return `Tasks: ${this.getDateDisplay(this.filter.dueDate)}`
        }
        return 'Tasks'
    }

    openDrawer() {
        this.sideDrawer.open(this.view)
    }

    getTaskList(): Task[] {
        const filteredTasks = this.tasks.filter((task) => this.isTaskVisible(task))
        // Check for changes to prevent unnecessary reloads of ListView
        if (taskListId(filteredTasks) !== taskListId(this.filteredTasks)) {
            this.filteredTasks = filteredTasks
        }
        return this.filteredTasks
    }

    private isTaskVisible(task: Task): boolean {
        let isVisible = !task.hidden
        // Default filter (hide old completed tasks)
        if (isVisible && task.complete) {
            const timeDiff = +new Date() - +task.completed
            const limit = 2 * 24 * 3600 * 1000 // 2 days
            isVisible = (timeDiff < limit)
        }
        // Filter by project
        if (isVisible && this.filter.project) {
            isVisible = (task.projects || []).includes(this.filter.project)
        }
        if (isVisible && this.filter.context) {
            isVisible = (task.contexts || []).includes(this.filter.context)
        }
        // Filter by due date
        if (isVisible && this.filter.dueDate) {
            isVisible = (
                task.due &&
                task.due.valueOf() === this.filter.dueDate.valueOf()
            )
        }
        return isVisible
    }

    private refreshTaskList() {
        if (isIOS) {
            // Workaround for iOS ListView bug
            // https://github.com/NativeScript/nativescript-angular/issues/377
            this.taskList.nativeElement.refresh()
        }
    }

    sortTaskList(): void {
        this.dialog.action(
            'Sort by',
            null,
            ['Due date', 'Priority'],
        ).then((choice: string) => {
            if (choice === 'Due date') {
                this.ordering = ['due', 'priority']
            } else if (choice === 'Priority') {
                this.ordering = ['priority', 'due']
            }
            this.settings.ordering = this.ordering
            this.tasks.sort(this.getSorter())
        })
    }

    isFilterEnabled(): boolean {
        return Object.keys(this.filter).length !== 0
    }

    setFilter(filter: TaskFilter) {
        this.filter = filter
        this.settings.filter = filter
    }

    removeFilter() {
        this.filter = {}
        this.settings.filter = {}
    }

    getTaskHtml(task: Task): string {
        const html = this.markdown.renderInline(task.text)
        if (task.complete) {
            return `<span style="text-decoration: line-through;">${html}</span>`
        } else {
            return html
        }
    }

    getTaskExtras(task: Task): string {
        if (task.created) {
            return `#${task.id} from ${this.getDateDisplay(task.created)}`
        } else {
            return `#${task.id}`
        }
    }

    showTaskMenu(task: Task, event: any) {
        if (isIOS && event.ios.state !== 3) {
            // Don't postpone until end of pressing
            // https://github.com/NativeScript/NativeScript/issues/3573
            return
        }
        this.dialog.action(
            task.text,
            'Choose action',
            ['Postpone', 'Edit', 'Remove'],
        ).then((action: string) => {
            if (action === 'Postpone') {
                this.postponeTask(task)
            } else if (action === 'Edit') {
                this.editTask(task, null)
            } else if (action === 'Remove') {
                this.removeTask(task)
            }
        })
    }

    toggleComplete(task: Task, event: any) {
        if (isWeb && event.ctrlKey) {
            // Postpone task on ctrl-click
            this.postponeTask(task)
            return
        }
        if (task.due && task.rec && !task.completed) {
            const newTask = task.recur()
            this.todoFile.appendTask(newTask)
        }
        task.toggleComplete()
        this.refreshTaskList()
        this.todoFile.replaceTask(task.id, task)
    }

    postponeTask(task: Task) {
        if (task.postpone()) {
            this.refreshTaskList()
            this.todoFile.replaceTask(task.id, task)
        }
    }

    editTask(task: Task, event: any) {
        if (isAndroid && event) {
            // Get tapped word
            const element = event.object.nativeView
            const tapPosition = element.getOffsetForPosition(
                event.android.getX(),
                event.android.getY(),
            )
            const text = element.getText().toString()
            const left = text.slice(0, tapPosition + 1).search(/\S+$/)
            const right = text.slice(tapPosition).search(/\s/)
            let word
            if (right < 0) {
                word = text.slice(left)
            } else {
                word = text.slice(left, right + tapPosition)
            }
            if (this.markdown.linkify.test(word)) {
                // This is a link, don't open form
                return
            }
        } else if (isWeb && event) {
            if (event.target.tagName.toLowerCase() === 'a') {
                // This is a link, don't open form
                return
            }
            if (event.view.getSelection().type === 'Range') {
                // This is a text selection event
                return
            }
        }
        this.router.navigate(['/task-detail', {taskId: task.id}])
    }

    removeTask(task: Task) {
        this.dialog.confirm(
            'Task removal',
            `Are you sure you want to remove "${task.text}"?`,
        ).then((result: boolean) => {
            if (result) {
                this.tasks.splice(this.tasks.indexOf(task), 1)
                this.todoFile.removeTask(task.id)
            }
        })
    }

    addTask() {
        this.router.navigate(['/task-detail'])
    }

    onHotKey(event: any) {
        if (isWeb && event.keyCode === 65 && event.altKey) {
            // {Alt + A} - add new task
            event.preventDefault()
            this.addTask()
        }
    }

    switchToTags(event: any): void {
        if (event.direction !== 2) {
            return
        }
        this.router.navigate(['/tags'])
    }

}
