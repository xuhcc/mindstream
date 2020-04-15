import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { FileService } from './file.service'

describe('FileService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
    }))

    it('should be created', () => {
        const service: FileService = TestBed.get(FileService)
        expect(service).toBeTruthy()
    })
})
