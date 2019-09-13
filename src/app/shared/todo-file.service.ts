import { Injectable } from '@angular/core';

import { TodoTxt, TodoTxtItem } from 'jstodotxt';

import { FileService } from './file.service';
import { RouterService } from './router.service';
import { SettingsService } from './settings.service';
import { Task, TaskData, getExtensions } from './task';
import { showToast } from './toast';

@Injectable({
    providedIn: 'root',
})
export class TodoFileService {

    content = '';
    todoItems: TodoTxtItem[] = [];

    constructor(
        private file: FileService,
        private router: RouterService,
        private settings: SettingsService,
    ) {
        if (settings.path) {
            this.load();
        }
    }

    private parse() {
        this.todoItems = TodoTxt.parse(this.content, getExtensions());
    }

    private render(): string {
        return TodoTxt.render(this.todoItems);
    }

    getProjects(): string[] {
        const projects = new Set();
        this.todoItems.forEach((todoItem: TodoTxtItem) => {
            (todoItem.projects || []).forEach((project: string) => {
                projects.add(project);
            });
        });
        return Array.from(projects).sort();
    }

    createTask(taskData: TaskData) {
        const task = Task.create(taskData);
        // Append to the end of file
        this.content += ('\n' + task.todoItem.toString());
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
        this.todoItems.splice(taskId, 1);
        this.content = this.render();
        this.save();
    }

    async load(): Promise<void> {
        try {
            this.content = await this.file.read(this.settings.path);
        } catch (error) {
            this.router.navigate(['/settings']);
            return;
        }
        this.parse();
        showToast('File loaded');
    }

    async save(): Promise<void> {
        await this.file.write(this.settings.path, this.content);
        this.parse();
    }

}
