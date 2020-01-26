import { TodoTxtItem } from 'jstodotxt';
import { DueExtension } from 'jstodotxt/jsTodoExtensions';
import * as moment from 'moment';

import {
    Task,
    getExtensions,
    RecurrenceExtension,
    TaskRecurrence,
    ColorExtension,
} from './task';
import { stringToDate } from './misc';

describe('TaskRecurrence', () => {
    it('should add day', () => {
        const date = new Date();
        const recurrence = new TaskRecurrence('1d');
        const newDate = recurrence.addTo(date);
        const diff = moment.duration(+newDate - +date);
        expect(diff.asDays()).toBeCloseTo(1);
    });

    it('should add month', () => {
        const date = new Date();
        const recurrence = new TaskRecurrence('1m');
        const newDate = recurrence.addTo(date);
        const diff = moment.duration(+newDate - +date);
        expect(diff.asMonths()).toBeCloseTo(1, 1);
    });
});

describe('DueExtension', () => {
    let extension;
    beforeEach(() => {
        extension = new DueExtension();
    });

    it('should parse line with due tag', () => {
        const line = 'test due:2019-01-01';
        const expectedDate = stringToDate('2019-01-01');
        const result = extension.parsingFunction(line);
        expect(result[0]).toEqual(expectedDate);
        expect(result[1]).toEqual('test ');
        expect(result[2]).toEqual('2019-01-01');
    });

    it('should parse line without due tag', () => {
        const line = 'test test:2019-01-01';
        const result = extension.parsingFunction(line);
        expect(result).toEqual([null, null, null]);
    });
});

describe('RecurrenceExtension', () => {
    let extension;
    beforeEach(() => {
        extension = new RecurrenceExtension();
    });

    it('should parse line with recurrence tag', () => {
        const line = 'test due:2019-01-01 rec:1w';
        const expectedRec = new TaskRecurrence('1w');
        const result = extension.parsingFunction(line);
        expect(result[0]).toEqual(expectedRec);
        expect(result[1]).toEqual('test due:2019-01-01 ');
        expect(result[2]).toEqual('1w');
    });

    it('should parse line without recurrence tag', () => {
        const line = 'test test:2019-01-01';
        const result = extension.parsingFunction(line);
        expect(result).toEqual([null, null, null]);
    });
});

describe('ColorExtension', () => {
    let extension;
    beforeEach(() => {
        extension = new ColorExtension();
    });

    it('should parse line with color tag', () => {
        const line = 'test color:#e4ebf7';
        const result = extension.parsingFunction(line);
        expect(result[0]).toEqual('#e4ebf7');
        expect(result[1]).toEqual('test ');
        expect(result[2]).toEqual('#e4ebf7');
    });

    it('should parse line without color tag', () => {
        const line = 'test test:2019-01-01';
        const result = extension.parsingFunction(line);
        expect(result).toEqual([null, null, null]);
    });
});

describe('Task', () => {
    it('should init', () => {
        const todoItem = new TodoTxtItem(
            '(A) test +proj @ctx due:2019-01-01',
            getExtensions(),
        );
        const task = new Task(todoItem);
        expect(task.todoItem).toBe(todoItem);
        expect(task.todoItem.extensions.length).toBe(4);
        expect(task.todoItem.date).toBe(null);
        expect(task.created).toBe(null);
        expect(task.text).toBe('test');
        expect(task.priority).toBe('A');
        expect(task.projects).toEqual(['proj']);
        expect(task.contexts).toEqual(['ctx']);
        expect(task.due).toEqual(stringToDate('2019-01-01'));
        expect(task.rec).toBe(undefined);
        expect(task.complete).toBe(false);
        expect(task.completed).toBe(null);
        expect(task.color).toBe(undefined);
        expect(task.hidden).toBe(false);
    });

    it('should get due date as priority', () => {
        const task = Task.parse('(B) test due:2019-01-01');
        expect(task.getDueDatePriority()).toBe('A');
    });

    it('should create task', () => {
        const formData = {
            text: 'test',
            projects: 'project1 project2',
            contexts: 'ctx1 ctx2',
            priority: 'A',
            dueDate: '2019-01-01',
            recurrence: '1w',
            color: '#ebebeb',
        };
        const task = Task.create(formData);
        expect(task.todoItem.text).toEqual('test');
        expect(task.todoItem.projects).toEqual([
            'project1',
            'project2',
        ]);
        expect(task.todoItem.contexts).toEqual(['ctx1', 'ctx2']);
        expect(task.todoItem.priority).toEqual('A');
        expect(task.todoItem.due).toEqual(stringToDate('2019-01-01'));
        expect(task.todoItem.dueString).toEqual('2019-01-01');
        expect(task.todoItem.rec.toString()).toEqual('1w');
        expect(task.todoItem.recString).toEqual('1w');
        expect(task.todoItem.color).toEqual('#ebebeb');
        expect(task.todoItem.colorString).toEqual('#ebebeb');
    });

    it('should update task', () => {
        const task = Task.parse('(A) test +proj @ctx due:2019-01-01');
        expect(task.todoItem.due).toBeDefined();

        const formData = {
            text: 'abc',
            projects: '',
            contexts: '',
            priority: 'B',
            dueDate: '',
            recurrence: '',
            color: '',
        };
        task.update(formData);
        expect(task.todoItem.text).toEqual('abc');
        expect(task.todoItem.projects).toBe(null);
        expect(task.todoItem.contexts).toBe(null);
        expect(task.todoItem.priority).toEqual('B');
        expect(task.todoItem.due).toBeUndefined();
        expect(task.todoItem.dueString).toBeUndefined();
        expect(task.todoItem.rec).toBeUndefined();
        expect(task.todoItem.recString).toBeUndefined();
        expect(task.todoItem.color).toBeUndefined();
        expect(task.todoItem.colorString).toBeUndefined();
    });

    it('should re-parse tags in task text on update', () => {
        const task = Task.parse('(A) test');
        expect(task.todoItem.h).toBeUndefined();
        const formData = {
            text: 'test-hidden h:1',
            projects: '',
            contexts: '',
            priority: 'A',
            dueDate: '',
            recurrence: '',
            color: '',
        };
        task.update(formData);
        expect(task.todoItem.text).toEqual('test-hidden');
        expect(task.todoItem.h).toBe(true);
        expect(task.todoItem.hString).toEqual('1');
    });

    it('should parse and render recurrence tag', () => {
        const taskStr = '(A) testTask due:2019-01-01 rec:1w';
        const task = Task.parse(taskStr);
        expect(task.text).toEqual('testTask');
        expect(task.rec.toString()).toEqual('1w');
        expect(task.todoItem.recString).toEqual('1w');
        expect(task.todoItem.toString()).toEqual(taskStr);
    });

    it('should transform to task data', () => {
        const task = Task.parse('(A) test +pro1 +pro2 due:2019-01-01 rec:1d');
        const taskData = task.toTaskData();
        expect(taskData).toEqual({
            text: 'test',
            projects: 'pro1 pro2',
            contexts: '',
            priority: 'A',
            dueDate: '2019-01-01',
            recurrence: '1d',
            color: '',
        });
    });

    it('should postpone task', () => {
        const task = Task.parse('test due:2019-12-31');
        task.postpone();
        expect(task.due).toEqual(stringToDate('2020-01-01'));
    });
});
