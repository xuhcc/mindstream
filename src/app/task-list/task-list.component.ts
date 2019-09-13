import { Component, OnInit, ViewContainerRef } from '@angular/core';

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
export class TaskListComponent implements OnInit {

    tasks: Task[] = [];
    filter: TaskFilter = {};
    ordering = firstBy('complete')
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
            // Copy
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

    refresh(event) {
        this.pullToRefresh.onRefresh(event, () => {
            this.loadTasks();
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

    isTaskVisible(task: Task): boolean {
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
                this.todoFile.removeTask(task.id);
            }
        });
    }

    addTask() {
        this.router.navigate(['/task-detail']);
    }

}
