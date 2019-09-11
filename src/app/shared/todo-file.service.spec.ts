import { TestBed } from '@angular/core/testing';

import { RouterService } from './router.service';
import { TodoFileService } from './todo-file.service';

describe('TodoFileService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {provide: RouterService, useValue: {}},
        ],
    }));

    it('should be created', () => {
        const service: TodoFileService = TestBed.get(TodoFileService);
        expect(service).toBeTruthy();
    });
});
