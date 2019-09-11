import { Injectable } from '@angular/core';

import { TodoTxt, TodoTxtItem } from 'jstodotxt';

import { FileService } from './file.service';
import { RouterService } from './router.service';
import { SettingsService } from './settings.service';
import { TaskData, getExtensions } from './task-data';
import { showToast } from './toast';

@Injectable({
    providedIn: 'root',
})
export class TodoFileService {

    content = '';
    tasks: TodoTxtItem[] = [];

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
        this.tasks = TodoTxt.parse(this.content, getExtensions());
    }

    createTask(taskData: TaskData) {
        const task = taskData.createTodoTxtItem();
        // Append to the end of file
        this.content += ('\n' + task.toString());
        this.save();
    }

    updateTask(taskId: number, taskData: TaskData) {
        const task = this.tasks[taskId];
        taskData.updateTodoTxtItem(task);
        // Rewrite all tasks
        this.content = TodoTxt.render(this.tasks);
        this.save();
    }

    replaceTask(taskId: number, task: TodoTxtItem) {
        this.tasks[taskId] = task;
        // Rewrite all tasks
        this.content = TodoTxt.render(this.tasks);
        this.save();
    }

    update(tasks: TodoTxtItem[]) {
        // Rewrite tasks in file
        this.content = TodoTxt.render(tasks);
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
