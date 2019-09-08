import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { TodoTxtItem } from 'jstodotxt';

import { SideDrawerService } from '../nav/sidedrawer.service';
import { PullToRefreshService } from '../shared/pulltorefresh.service';
import { RouterService } from '../shared/router.service';
import { TodoFileService } from '../shared/todo-file.service';
import { compareEmptyGreater } from '../shared/misc';

// Use 'require' because the TypeScript module is buggy
const firstBy = require('thenby'); // eslint-disable-line @typescript-eslint/no-var-requires

@Component({
    selector: 'ms-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {

    tasks: TodoTxtItem[] = [];
    taskOrder = firstBy('complete')
        .thenBy('due', {cmp: compareEmptyGreater})
        .thenBy('priority', {cmp: compareEmptyGreater});

    constructor(
        private router: RouterService,
        public todoFile: TodoFileService,
        private sideDrawer: SideDrawerService,
        private viewContainerRef: ViewContainerRef,
        private pullToRefresh: PullToRefreshService, // TODO: simply 'refresh'
    ) { }

    ngOnInit() {
        this.loadTasks();
    }

    loadTasks() {
        this.todoFile.load().then(() => {
            // Deep copy
            this.tasks = [...this.todoFile.tasks];
            // Set IDs
            // TODO: index can change if file has been updated from another device
            // TODO: use UUIDs?
            this.tasks.forEach((task, index) => {
                task.id = index;
            });
            // Sort tasks
            this.tasks.sort(this.taskOrder);
        });
    }

    refresh(event) {
        this.pullToRefresh.onRefresh(event, () => {
            this.loadTasks();
        });
    }

    openDrawer() {
        this.sideDrawer.open(this.viewContainerRef);
    }

    isTaskVisible(task: TodoTxtItem): boolean {
        if (task.complete) {
            const timeDiff = +new Date() - task.completed;
            return (timeDiff < 24 * 3600 * 1000); // 1 day
        }
        return true;
    }

    toggleCheckBox(task: TodoTxtItem) {
        if (!task.complete) {
            task.complete = true;
            task.completed = new Date();
        } else {
            task.complete = false;
            task.completed = null;
        }
        this.todoFile.replaceTask(task.id, task);
    }

    editTask(task: TodoTxtItem) {
        this.router.navigate(['/task-detail', {taskId: task.id}]);
    }

    addTask() {
        this.router.navigate(['/task-detail']);
    }

}
