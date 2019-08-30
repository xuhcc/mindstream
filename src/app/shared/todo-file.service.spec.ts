import { TestBed } from '@angular/core/testing';

import { TodoFileService } from './todo-file.service';

describe('TodoFileService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: TodoFileService = TestBed.get(TodoFileService);
        expect(service).toBeTruthy();
    });
});
