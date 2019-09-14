import { TodoTxtItem } from 'jstodotxt';
import { TodoTxtExtension, DueExtension } from 'jstodotxt/jsTodoExtensions';
import * as moment from 'moment';

import { dateToString, stringToDate } from '../shared/misc';

export function RecurrenceExtension() {
    this.name = 'rec';
}

RecurrenceExtension.prototype = new TodoTxtExtension();

RecurrenceExtension.prototype.parsingFunction = (line: string): string[] => {
    // https://github.com/mpcjanssen/simpletask-android/blob/master/app/src/main/assets/index.en.md#extensions
    const regexp = /rec:(\d(d|w|m))(\s|$)/;
    const match = regexp.exec(line);
    if (match) {
        return [
            match[1], // rec
            line.replace(regexp, ''), // line with tag removed
            match[1], // recString
        ];
    }
    // Return nulls if not found
    return [null, null, null];
};

export function getExtensions(): TodoTxtExtension[] {
    return [
        new DueExtension(),
        new RecurrenceExtension(),
    ];
}

export interface TaskData {
    text: string;
    project: string;
    priority: string;
    dueDate: string;
    recurrence: string;
}

export class Task {

    id: number;
    todoItem: TodoTxtItem;

    constructor(todoItem: TodoTxtItem) {
        this.todoItem = todoItem;
    }

    get text(): string {
        return this.todoItem.text;
    }

    get projects(): string[] {
        return this.todoItem.projects;
    }

    get priority(): string {
        return this.todoItem.priority;
    }

    get due(): Date {
        return this.todoItem.due;
    }

    get rec(): string {
        return this.todoItem.rec;
    }

    get complete(): boolean {
        return this.todoItem.complete;
    }

    get completed(): Date {
        return this.todoItem.completed;
    }

    isOverdue(): boolean {
        if (!this.todoItem.due) {
            return false;
        }
        return moment(this.todoItem.due) < moment().startOf('day');
    }

    static create(taskData: TaskData): Task {
        const todoItem = new TodoTxtItem(taskData.text, getExtensions());
        todoItem.date = new Date();
        if (taskData.project) {
            todoItem.projects = [taskData.project];
        }
        if (taskData.priority) {
            todoItem.priority = taskData.priority;
        }
        if (taskData.dueDate) {
            todoItem.due = stringToDate(taskData.dueDate);
            todoItem.dueString = taskData.dueDate;
        }
        if (taskData.recurrence) {
            todoItem.rec = taskData.recurrence;
            todoItem.recString = taskData.recurrence;
        }
        return new Task(todoItem);
    }

    static parse(text: string): Task {
        const todoItem = new TodoTxtItem(text, getExtensions());
        return new Task(todoItem);
    }

    clone(): Task {
        const todoItemStr = this.todoItem.toString();
        return Task.parse(todoItemStr);
    }

    update(taskData: TaskData) {
        this.todoItem.text = taskData.text;
        if (taskData.project) {
            this.todoItem.projects = [taskData.project];
        } else {
            this.todoItem.projects = null;
        }
        this.todoItem.priority = taskData.priority;
        if (taskData.dueDate) {
            this.todoItem.due = stringToDate(taskData.dueDate);
            this.todoItem.dueString = taskData.dueDate;
        } else {
            delete this.todoItem.due;
            delete this.todoItem.dueString;
        }
        if (taskData.recurrence) {
            this.todoItem.rec = taskData.recurrence;
            this.todoItem.recString = taskData.recurrence;
        } else {
            delete this.todoItem.rec;
            delete this.todoItem.recString;
        }
    }

    toTaskData(): TaskData {
        let project = '';
        if (this.todoItem.projects && this.todoItem.projects.length > 0) {
            project = this.todoItem.projects[0];
        }
        let dueDate = '';
        if (this.todoItem.due) {
            dueDate = dateToString(this.todoItem.due);
        }
        return {
            text: this.todoItem.text,
            project: project,
            priority: this.todoItem.priority,
            dueDate: dueDate,
            recurrence: this.todoItem.rec,
        };
    }

    toggleComplete() {
        if (!this.todoItem.complete) {
            this.todoItem.complete = true;
            this.todoItem.completed = new Date();
        } else {
            this.todoItem.complete = false;
            this.todoItem.completed = null;
        }
    }

    postpone() {
        if (!this.todoItem.due) {
            return false;
        }
        const newDueDate = new Date(this.todoItem.due);
        newDueDate.setDate(newDueDate.getDate() + 1);
        this.todoItem.due = newDueDate;
        this.todoItem.dueString = dateToString(newDueDate);
        return true;
    }

    recur(): Task {
        if (this.todoItem.due && this.todoItem.rec) {
            const newDueDate = moment(this.todoItem.due).add(
                parseInt(this.todoItem.rec.substring(0, 1)),
                this.todoItem.rec.substring(1, 2),
            ).toDate();
            const newTask = this.clone();
            newTask.todoItem.due = newDueDate;
            newTask.todoItem.dueString = dateToString(newDueDate);
            return newTask;
        }
    }
}
