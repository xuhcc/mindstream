import { TodoTxtItem } from 'jstodotxt';
import { DueExtension } from 'jstodotxt/jsTodoExtensions';
import * as moment from 'moment';

import { Task, getExtensions, RecurrenceExtension, TaskRecurrence } from './task';
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

    it('should parse line without due tag', () => {
        const line = 'test test:2019-01-01';
        const result = extension.parsingFunction(line);
        expect(result).toEqual([null, null, null]);
    });
});

describe('Task', () => {
    it('should init', () => {
        const todoItem = new TodoTxtItem(
            '(A) test +proj due:2019-01-01',
            getExtensions(),
        );
        const task = new Task(todoItem);
        expect(task.todoItem).toBe(todoItem);
        expect(task.todoItem.extensions.length).toBe(3);
        expect(task.todoItem.date).toBe(null);
        expect(task.text).toBe('test');
        expect(task.priority).toBe('A');
        expect(task.projects).toEqual(['proj']);
        expect(task.due).toEqual(stringToDate('2019-01-01'));
        expect(task.complete).toBe(false);
        expect(task.completed).toBe(null);
        expect(task.hidden).toBe(false);
    });

    it('should get due date as priority', () => {
        const task = Task.parse('(B) test due:2019-01-01');
        expect(task.getDueDatePriority()).toBe('A');
    });

    it('should create task', () => {
        const formData = {
            text: 'test',
            projects: 'testproject1 testproject2',
            priority: 'A',
            dueDate: '2019-01-01',
            recurrence: '1w',
        };
        const task = Task.create(formData);
        expect(task.todoItem.text).toEqual('test');
        expect(task.todoItem.projects).toEqual([
            'testproject1',
            'testproject2',
        ]);
        expect(task.todoItem.priority).toEqual('A');
        expect(task.todoItem.due).toEqual(stringToDate('2019-01-01'));
        expect(task.todoItem.dueString).toEqual('2019-01-01');
        expect(task.todoItem.rec.toString()).toEqual('1w');
        expect(task.todoItem.recString).toEqual('1w');
    });

    it('should update task', () => {
        const task = Task.parse('(A) test +proj due:2019-01-01');
        expect(task.todoItem.due).toBeDefined();

        const formData = {
            text: 'abc',
            projects: '',
            priority: 'B',
            dueDate: '',
            recurrence: '',
        };
        task.update(formData);
        expect(task.todoItem.text).toEqual('abc');
        expect(task.todoItem.projects).toBe(null);
        expect(task.todoItem.priority).toEqual('B');
        expect(task.todoItem.due).toBeUndefined();
        expect(task.todoItem.dueString).toBeUndefined();
        expect(task.todoItem.rec).toBeUndefined();
        expect(task.todoItem.recString).toBeUndefined();
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
            priority: 'A',
            dueDate: '2019-01-01',
            recurrence: '1d',
        });
    });
});
