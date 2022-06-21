import { TodoTxtItem } from 'jstodotxt'
import {
    TodoTxtExtension,
    DueExtension,
    HiddenExtension,
} from 'jstodotxt/jsTodoExtensions'
import * as moment from 'moment'

import { dateToString, stringToDate, splitStringWithSpace } from './misc'

export const PROJECT_REGEXP = /^[^+\s]+$/
export const PROJECT_LIST_REGEXP = /^[^+]+$/
export const CONTEXT_LIST_REGEXP = /^[^@]+$/
export const PRIORITY_REGEXP = /^[A-Z]$/
export const DATESTRING_REGEXP = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])$/

export enum DateType {
    Past = 'past',
    Today = 'today',
    Tomorrow = 'tomorrow',
    Future = 'future',
}

export function getDateType(date: Date): DateType {
    const mDate = moment(date)
    const today = moment().startOf('day')
    const tomorrow = today.clone().add(1, 'day')
    if (mDate < today) {
        return DateType.Past
    } else if (mDate.isSame(today)) {
        return DateType.Today
    } else if (mDate.isSame(tomorrow)) {
        return DateType.Tomorrow
    } else {
        return DateType.Future
    }
}

export const RECURRENCE_REGEXP = /^([1-9][0-9]*)(d|w|m|y)$/
const RECURRENCE_TAG_REGEXP = /rec:([1-9][0-9]*(d|w|m|y))(\s|$)/
const RECURRENCE_KEYS = {
    d: 'day',
    w: 'week',
    m: 'month',
    y: 'year',
}

export class TaskRecurrence {

    amount: number;
    key: string;

    constructor(value: string) {
        const match = value.match(RECURRENCE_REGEXP)
        this.amount = parseInt(match[1])
        this.key = match[2]
    }

    toString(): string {
        return `${this.amount}${this.key}`
    }

    addTo(date: Date): Date {
        const mDate = moment(date) as any
        const newDate = mDate.add(
            this.amount,
            this.key === 'm' ? 'M' : this.key,
        ).toDate()
        return newDate
    }

    display(): string {
        let result = 'every '
        if (this.amount > 1) {
            result += `${this.amount} `
        }
        result += RECURRENCE_KEYS[this.key]
        return result
    }
}

export function RecurrenceExtension() {
    this.name = 'rec'
}

RecurrenceExtension.prototype = new TodoTxtExtension()

RecurrenceExtension.prototype.parsingFunction = (line: string): any[] => {
    // https://github.com/mpcjanssen/simpletask-android/blob/master/app/src/main/assets/index.en.md#extensions
    const match = RECURRENCE_TAG_REGEXP.exec(line)
    if (match) {
        return [
            new TaskRecurrence(match[1]), // rec
            line.replace(RECURRENCE_TAG_REGEXP, ''), // line with tag removed
            match[1], // recString
        ]
    }
    // Return nulls if not found
    return [null, null, null]
}

export const COLOR_REGEXP = /^(#[0-9a-fA-F]{6})$/
const COLOR_TAG_REGEXP = /color:(#[0-9a-fA-F]{6})(\s|$)/

export function ColorExtension() {
    this.name = 'color'
}

ColorExtension.prototype = new TodoTxtExtension()

ColorExtension.prototype.parsingFunction = (line: string): any[] => {
    const match = COLOR_TAG_REGEXP.exec(line)
    if (match) {
        return [
            match[1], // color
            line.replace(COLOR_TAG_REGEXP, ''), // line with tag removed
            match[1], // colorString
        ]
    }
    // Return nulls if not found
    return [null, null, null]
}

export function getExtensions(): TodoTxtExtension[] {
    return [
        new DueExtension(),
        new RecurrenceExtension(),
        new HiddenExtension(),
        new ColorExtension(),
    ]
}

export interface TaskData {
    text: string;
    projects: string;
    contexts: string;
    priority: string;
    dueDate: string;
    recurrence: string;
    color: string;
}

export class Task {

    id: number;
    todoItem: TodoTxtItem;

    constructor(todoItem: TodoTxtItem) {
        this.todoItem = todoItem
    }

    get created(): Date {
        return this.todoItem.date
    }

    get text(): string {
        return this.todoItem.text
    }

    get projects(): string[] {
        return this.todoItem.projects
    }

    get contexts(): string[] {
        return this.todoItem.contexts
    }

    get priority(): string {
        return this.todoItem.priority
    }

    get due(): Date {
        return this.todoItem.due
    }

    get rec(): string {
        return this.todoItem.rec
    }

    get complete(): boolean {
        return this.todoItem.complete
    }

    get completed(): Date {
        return this.todoItem.completed
    }

    get color(): string {
        return this.todoItem.color
    }

    get hidden(): boolean {
        return this.todoItem.h || false
    }

    getDueDatePriority(): string {
        if (!this.todoItem.due) {
            return 'Z'
        }
        const dueDateType = getDateType(this.todoItem.due)
        if (dueDateType === DateType.Past) {
            return 'A'
        } else if (dueDateType === DateType.Today) {
            return 'B'
        } else if (dueDateType === DateType.Tomorrow) {
            return 'C'
        } else {
            return 'Z'
        }
    }

    static create(taskData: TaskData): Task {
        const todoItem = new TodoTxtItem(taskData.text, getExtensions())
        todoItem.date = new Date()
        if (taskData.projects) {
            todoItem.projects = splitStringWithSpace(taskData.projects)
        }
        if (taskData.contexts) {
            todoItem.contexts = splitStringWithSpace(taskData.contexts)
        }
        if (taskData.priority) {
            todoItem.priority = taskData.priority
        }
        if (taskData.dueDate) {
            todoItem.due = stringToDate(taskData.dueDate)
            todoItem.dueString = taskData.dueDate
        }
        if (taskData.recurrence) {
            todoItem.rec = new TaskRecurrence(taskData.recurrence)
            todoItem.recString = taskData.recurrence
        }
        if (taskData.color) {
            todoItem.color = taskData.color
            todoItem.colorString = taskData.color
        }
        return new Task(todoItem)
    }

    static parse(text: string): Task {
        const todoItem = new TodoTxtItem(text, getExtensions())
        return new Task(todoItem)
    }

    clone(): Task {
        const todoItemStr = this.todoItem.toString()
        return Task.parse(todoItemStr)
    }

    update(taskData: TaskData): void {
        this.todoItem.text = taskData.text
        if (taskData.projects) {
            this.todoItem.projects = splitStringWithSpace(taskData.projects)
        } else {
            this.todoItem.projects = null
        }
        if (taskData.contexts) {
            this.todoItem.contexts = splitStringWithSpace(taskData.contexts)
        } else {
            this.todoItem.contexts = null
        }
        if (taskData.priority) {
            this.todoItem.priority = taskData.priority
        } else {
            this.todoItem.priority = null
        }
        if (taskData.dueDate) {
            this.todoItem.due = stringToDate(taskData.dueDate)
            this.todoItem.dueString = taskData.dueDate
        } else {
            delete this.todoItem.due
            delete this.todoItem.dueString
        }
        if (taskData.recurrence) {
            this.todoItem.rec = new TaskRecurrence(taskData.recurrence)
            this.todoItem.recString = taskData.recurrence
        } else {
            delete this.todoItem.rec
            delete this.todoItem.recString
        }
        if (taskData.color) {
            this.todoItem.color = taskData.color
            this.todoItem.colorString = taskData.color
        } else {
            delete this.todoItem.color
            delete this.todoItem.colorString
        }
        // Re-parse the text
        this.todoItem.parse(this.todoItem.toString())
    }

    toTaskData(): TaskData {
        let projects = ''
        if (this.todoItem.projects && this.todoItem.projects.length > 0) {
            projects = this.todoItem.projects.join(' ')
        }
        let contexts = ''
        if (this.todoItem.contexts && this.todoItem.contexts.length > 0) {
            contexts = this.todoItem.contexts.join(' ')
        }
        let dueDate = ''
        if (this.todoItem.due) {
            dueDate = dateToString(this.todoItem.due)
        }
        let recurrence = ''
        if (this.todoItem.rec) {
            recurrence = this.todoItem.rec.toString()
        }
        return {
            text: this.todoItem.text,
            projects: projects,
            contexts: contexts,
            priority: this.todoItem.priority,
            dueDate: dueDate,
            recurrence: recurrence,
            color: this.todoItem.color || '',
        }
    }

    toggleComplete(): void {
        if (!this.todoItem.complete) {
            this.todoItem.complete = true
            this.todoItem.completed = new Date()
        } else {
            this.todoItem.complete = false
            this.todoItem.completed = null
        }
    }

    postpone(): boolean {
        if (!this.todoItem.due) {
            return false
        }
        const newDueDate = moment(new Date(this.todoItem.due))
            .add(1, 'day').toDate()
        this.todoItem.due = newDueDate
        this.todoItem.dueString = dateToString(newDueDate)
        return true
    }

    recur(): Task {
        if (this.todoItem.due && this.todoItem.rec) {
            const newDueDate = this.todoItem.rec.addTo(this.todoItem.due)
            const newTask = this.clone()
            newTask.todoItem.due = newDueDate
            newTask.todoItem.dueString = dateToString(newDueDate)
            return newTask
        }
    }
}
