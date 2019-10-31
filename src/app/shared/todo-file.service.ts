import { Injectable, OnDestroy } from '@angular/core';

import { TodoTxt, TodoTxtItem } from 'jstodotxt';
import { Subject, Subscription, interval } from 'rxjs';

import { FileService } from './file.service';
import { RouterService } from './router.service';
import { SettingsService } from './settings.service';
import { Task, TaskData, getExtensions } from './task';
import { showToast } from './helpers/toast';

const FILE_WATCH_INTERVAL = 60 * 1000;

@Injectable({
    providedIn: 'root',
})
export class TodoFileService implements OnDestroy {

    content = '';
    todoItems: TodoTxtItem[] = [];
    fileChanged: Subject<boolean>;
    watcher: Subscription;

    constructor(
        private file: FileService,
        private router: RouterService,
        private settings: SettingsService,
    ) {
        this.fileChanged = new Subject();
        // Initial load
        if (settings.path) {
            this.load();
        }
        // Periodic reload
        this.watcher = interval(FILE_WATCH_INTERVAL).subscribe(() => {
            if (!settings.path) {
                // No path to watch
                return;
            }
            this.load(true);
        });
    }

    ngOnDestroy(): void {
        // Stop file watcher when service is destroyed
        this.watcher.unsubscribe();
    }

    private parse() {
        this.todoItems = TodoTxt.parse(this.content, getExtensions());
    }

    private render(): string {
        return TodoTxt.render(this.todoItems);
    }

    getProjects(): string[] {
        const projects = new Set<string>();
        this.todoItems.forEach((todoItem: TodoTxtItem) => {
            (todoItem.projects || []).forEach((project: string) => {
                projects.add(project);
            });
        });
        return Array.from(projects).sort();
    }

    createTask(taskData: TaskData) {
        const task = Task.create(taskData);
        this.appendTask(task);
    }

    appendTask(task: Task) {
        // Append to the end of file
        this.todoItems.push(task.todoItem);
        this.content = this.render();
        this.save();
    }

    updateTask(taskId: number, taskData: TaskData) {
        const task = new Task(this.todoItems[taskId]);
        task.update(taskData);
        // Rewrite all tasks
        this.content = this.render();
        this.save();
    }

    replaceTask(taskId: number, task: Task) {
        this.todoItems[taskId] = task.todoItem;
        // Rewrite all tasks
        this.content = this.render();
        this.save();
    }

    removeTask(taskId: number) {
        // Keep task IDs intact
        delete this.todoItems[taskId];
        this.content = this.render();
        this.save();
    }

    async load(watch = false): Promise<void> {
        let content;
        try {
            content = await this.file.read(this.settings.path);
        } catch (error) {
            if (watch) {
                // Ignore error
                console.warn(error);
            } else {
                this.router.navigate(['/settings']);
            }
            return;
        }
        if (watch && this.content && this.content === content) {
            // No changes for watcher
            return;
        }
        this.content = content;
        this.parse();
        this.fileChanged.next(true); // true = trigger task list reload
        try {
            showToast('File loaded');
        } catch (error) {
            // Ignore error if view is not ready
            console.warn(error);
        }
    }

    async save(): Promise<void> {
        await this.file.write(this.settings.path, this.content);
        this.parse();
        this.fileChanged.next(false);
    }

    async create(): Promise<string> {
        return this.file.create('todo.txt');
    }

}
