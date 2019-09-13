import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';

import { Subscription } from 'rxjs';

import { SideDrawerService } from '../nav/sidedrawer.service';
import { showConfirmDialog } from '../shared/dialogs';
import { PullToRefreshService } from '../shared/pulltorefresh.service';
import { RouterService } from '../shared/router.service';
import { TodoFileService } from '../shared/todo-file.service';
import { Task } from '../shared/task';
import { compareEmptyGreater } from '../shared/misc';

// Use 'require' because the TypeScript module is buggy
const firstBy = require('thenby'); // eslint-disable-line @typescript-eslint/no-var-requires

interface TaskFilter {
    project?: string;
}

@Component({
    selector: 'ms-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit, OnDestroy {

    tasks: Task[] = [];
    filter: TaskFilter = {};
    ordering = firstBy('complete')
        .thenBy('due', {cmp: compareEmptyGreater})
        .thenBy('priority', {cmp: compareEmptyGreater});

    private fileSubscription: Subscription;

    constructor(
        private router: RouterService,
        public todoFile: TodoFileService,
        private sideDrawer: SideDrawerService,
        private viewContainerRef: ViewContainerRef,
        private pullToRefresh: PullToRefreshService, // TODO: simply 'refresh'
    ) { }

    ngOnInit() {
        // Workarounds for NS
        // ngOnInit is not called after back-navigation
        // ngOnDestroy is not called before navigation
        // https://github.com/NativeScript/nativescript-angular/issues/1049
        this.router.onNavigatedTo(this.viewContainerRef, () => {
            this.fileSubscribe();
            this.todoFile.load();
        });
        this.router.onNavigatingFrom(this.viewContainerRef, () => {
            this.fileUnsubscribe();
        });
    }

    ngOnDestroy() {
        this.fileUnsubscribe();
    }

    private fileSubscribe() {
        this.fileSubscription = this.todoFile.fileChanged.subscribe((reload) => {
            if (!reload) {
                return;
            }
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
        });
    }

    private fileUnsubscribe() {
        this.fileSubscription.unsubscribe();
    }

    refresh(event) {
        this.pullToRefresh.onRefresh(event, () => {
            this.todoFile.load();
        });
    }

    get title(): string {
        if (this.filter.project) {
            return `Tasks: ${this.filter.project}`;
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
            isVisible = (timeDiff < 24 * 3600 * 1000); // 1 day
        } else {
            isVisible = true;
        }
        // Filter by project
        if (isVisible && this.filter.project) {
            isVisible = (task.projects || []).includes(this.filter.project);
        }
        return isVisible;
    }

    isFilterEnabled(): boolean {
        return Object.keys(this.filter).length !== 0;
    }

    removeFilter() {
        this.filter = {};
    }

    toggleComplete(task: Task) {
        task.toggleComplete();
        this.todoFile.replaceTask(task.id, task);
    }

    postponeTask(task: Task) {
        if (task.postpone()) {
            this.todoFile.replaceTask(task.id, task);
        }
    }

    editTask(task: Task) {
        this.router.navigate(['/task-detail', {taskId: task.id}]);
    }

    removeTask(task: Task) {
        showConfirmDialog(
            'Task removal',
            'Are you sure you want to remove task?',
        ).then((result: boolean) => {
            if (result) {
                this.tasks.splice(this.tasks.indexOf(task), 1);
                this.todoFile.removeTask(task.id);
            }
        });
    }

    addTask() {
        this.router.navigate(['/task-detail']);
    }

}
