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
    fileLoaded: Promise<void>;
    fileChanged: Subject<boolean>;
    private watcher: Subscription;

    constructor(
        private file: FileService,
        private router: RouterService,
        private settings: SettingsService,
    ) {
        this.fileChanged = new Subject();
        // Initial load
        if (settings.path) {
            this.initialLoad();
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

    initialLoad(): Promise<void> {
        // Called on init and every time the file is switched
        this.fileLoaded = this.load();
        return this.fileLoaded;
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

    getTask(taskId: number): Task {
        return new Task(this.todoItems[taskId - 1]);
    }

    getTasks(): Task[] {
        return this.todoItems.map((todoItem, index) => {
            const task = new Task(todoItem);
            // Set IDs (line number, starting with 1, similar to todo.sh)
            // TODO: index can change if file has been updated from another device
            // TODO: use UUIDs?
            task.id = index + 1;
            return task;
        });
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
        const task = new Task(this.todoItems[taskId - 1]);
        task.update(taskData);
        // Rewrite all tasks
        this.content = this.render();
        this.save();
    }

    replaceTask(taskId: number, task: Task) {
        this.todoItems[taskId - 1] = task.todoItem;
        // Rewrite all tasks
        this.content = this.render();
        this.save();
    }

    removeTask(taskId: number) {
        delete this.todoItems[taskId - 1]; // Keeps task IDs intact
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
        this.fileChanged.next(true); // true = IDs are probably changed
        try {
            showToast('File loaded');
        } catch (error) {
            // Ignore error if view is not ready
            console.warn(error);
        }
    }

    async save(): Promise<void> {
        await this.file.write(this.settings.path, this.content);
        this.fileChanged.next(false); // false => IDs are not changed
    }

    async create(): Promise<string> {
        return this.file.create('todo.txt');
    }

}
