import { Component, OnInit, OnDestroy, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';

import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { SideDrawerService } from '../nav/sidedrawer.service';
import { PullToRefreshService } from '../shared/pulltorefresh.service';
import { RouterService } from '../shared/router.service';
import { TaskFilter } from '../shared/settings';
import { SettingsService } from '../shared/settings.service';
import { TodoFileService } from '../shared/todo-file.service';
import { Task } from '../shared/task';
import { compareEmptyGreater } from '../shared/misc';
import { showConfirmDialog } from '../shared/helpers/dialogs';
import { isIOS } from '../shared/helpers/platform';

// Use 'require' because the TypeScript module is buggy
const firstBy = require('thenby'); // eslint-disable-line @typescript-eslint/no-var-requires

@Component({
    selector: 'ms-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit, OnDestroy {

    tasks: Task[] = [];
    filter: TaskFilter = {};
    private ordering = firstBy('complete')
        .thenBy('due', {cmp: compareEmptyGreater})
        .thenBy('priority', {cmp: compareEmptyGreater});

    private fileSubscription: Subscription;

    @ViewChild('taskList', {static: false})
    taskList: ElementRef;

    constructor(
        private router: RouterService,
        private settings: SettingsService,
        private todoFile: TodoFileService,
        private sideDrawer: SideDrawerService,
        private viewContainerRef: ViewContainerRef,
        private pullToRefresh: PullToRefreshService, // TODO: simply 'refresh'
    ) { }

    ngOnInit() {
        this.filter = this.settings.filter;
        this.createTaskList();
        // Workarounds for NS
        // ngOnInit is not called after back-navigation
        // ngOnDestroy is not called before navigation
        // https://github.com/NativeScript/nativescript-angular/issues/1049
        this.router.onNavigatedTo(this.viewContainerRef, () => {
            this.fileSubscribe();
        });
        this.router.onNavigatingFrom(this.viewContainerRef, () => {
            this.fileUnsubscribe();
        });
    }

    ngOnDestroy() {
        this.fileUnsubscribe();
    }

    private createTaskList() {
        this.tasks = this.todoFile.todoItems.map((todoItem, index) => {
            const task = new Task(todoItem);
            // Set IDs
            // TODO: index can change if file has been updated from another device
            // TODO: use UUIDs?
            task.id = index;
            return task;
        });
        // Sort tasks
        this.tasks.sort(this.ordering);
    }

    private fileSubscribe() {
        this.fileSubscription = this.todoFile.fileChanged.subscribe((reload) => {
            if (!reload) {
                return;
            }
            this.createTaskList();
        });
    }

    private fileUnsubscribe() {
        this.fileSubscription.unsubscribe();
    }

    reloadFile(event: any) {
        this.pullToRefresh.onRefresh(event, () => {
            this.todoFile.load();
        });
    }

    getDateDisplay(date: Date): string {
        const mDate = moment(date);
        const today = moment().startOf('day');
        const tomorrow = today.clone().add(1, 'day');
        if (mDate.isSame(today)) {
            return 'today';
        } else if (mDate.isSame(tomorrow)) {
            return 'tomorrow';
        } else {
            return formatDate(date, 'dd.MM.yyyy', 'en-US');
        }
    }

    get title(): string {
        if (this.filter.project) {
            return `Tasks: ${this.filter.project}`;
        }
        if (this.filter.dueDate) {
            return `Tasks: ${this.getDateDisplay(this.filter.dueDate)}`;
        }
        return 'Tasks';
    }

    openDrawer() {
        this.sideDrawer.open(this.viewContainerRef);
    }

    getTaskList(): Task[] {
        return this.tasks.filter((task) => this.isTaskVisible(task));
    }

    private isTaskVisible(task: Task): boolean {
        let isVisible = true;
        // Default filter
        if (task.complete) {
            const timeDiff = +new Date() - +task.completed;
            const limit = 2 * 24 * 3600 * 1000; // 2 days
            isVisible = (timeDiff < limit);
        } else {
            isVisible = true;
        }
        // Filter by project
        if (isVisible && this.filter.project) {
            isVisible = (task.projects || []).includes(this.filter.project);
        }
        // Filter by due date
        if (isVisible && this.filter.dueDate) {
            isVisible = (
                task.due &&
                task.due.valueOf() === this.filter.dueDate.valueOf()
            );
        }
        return isVisible;
    }

    private refreshTaskList() {
        if (isIOS) {
            // Workaround for iOS ListView bug
            // https://github.com/NativeScript/nativescript-angular/issues/377
            this.taskList.nativeElement.refresh();
        }
    }

    isFilterEnabled(): boolean {
        return Object.keys(this.filter).length !== 0;
    }

    setFilter(filter: TaskFilter) {
        this.filter = filter;
        this.settings.filter = filter;
    }

    removeFilter() {
        this.filter = {};
        this.settings.filter = {};
    }

    toggleComplete(task: Task) {
        if (task.due && task.rec && !task.completed) {
            const newTask = task.recur();
            this.todoFile.appendTask(newTask);
        }
        task.toggleComplete();
        this.refreshTaskList();
        this.todoFile.replaceTask(task.id, task);
    }

    postponeTask(task: Task, event: any) {
        if (isIOS && event.ios.state !== 3) {
            // Don't postpone until end of pressing
            // https://github.com/NativeScript/NativeScript/issues/3573
            return;
        }
        if (task.postpone()) {
            this.refreshTaskList();
            this.todoFile.replaceTask(task.id, task);
        }
    }

    editTask(task: Task) {
        this.router.navigate(['/task-detail', {taskId: task.id}]);
    }

    removeTask(task: Task, event: any) {
        // Only when swiping right and left (NS SwipeDirection enum)
        if (event.direction === 1 || event.direction === 2) {
            showConfirmDialog(
                'Task removal',
                `Are you sure you want to remove "${task.text}"?`,
            ).then((result: boolean) => {
                if (result) {
                    this.tasks.splice(this.tasks.indexOf(task), 1);
                    this.todoFile.removeTask(task.id);
                }
            });
        }
    }

    addTask() {
        this.router.navigate(['/task-detail']);
    }

}
