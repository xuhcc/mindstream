import { Injectable } from '@angular/core';

import { TodoTxt, TodoTxtItem } from 'jstodotxt';
import { TodoTxtExtension, DueExtension } from 'jstodotxt/jsTodoExtensions';

import { FileService } from './file.service';
import { SettingsService } from './settings.service';

export interface TaskData {
    text: string;
    project: string;
    priority: string;
    dueDate: string;
}

@Injectable({
    providedIn: 'root',
})
export class TodoFileService {

    content = '';
    tasks: TodoTxtItem[] = [];

    constructor(
        private settings: SettingsService,
        private file: FileService,
    ) {
        if (settings.path) {
            this.load();
        }
    }

    get extensions(): TodoTxtExtension[] {
        return [new DueExtension()];
    }

    private parse() {
        this.tasks = TodoTxt.parse(this.content, this.extensions);
    }

    private updateTaskAttributes(task: TodoTxtItem, taskData: TaskData) {
        if (taskData.project) {
            task.projects = [taskData.project];
        }
        if (taskData.priority) {
            task.priority = taskData.priority;
        }
        if (taskData.dueDate) {
            task.due = new Date(taskData.dueDate);
            task.dueString = taskData.dueDate;
        }
    }

    createTask(taskData: TaskData) {
        const task = new TodoTxtItem(taskData.text, this.extensions);
        task.date = new Date();
        this.updateTaskAttributes(task, taskData);
        // Append to the end of file
        this.content += ('\n' + task.toString());
        this.save();
    }

    updateTask(taskId: number, taskData: TaskData) {
        const task = this.tasks[taskId];
        task.text = taskData.text;
        this.updateTaskAttributes(task, taskData);
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
        this.content = await this.file.read(this.settings.path);
        this.parse();
        console.log('file loaded');
    }

    async save(): Promise<void> {
        await this.file.write(this.settings.path, this.content);
        this.parse();
        console.log('file saved');
    }

}
