import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormControl } from '@angular/forms'

import { TaskFormAutocompleteComponent } from './task-form-autocomplete.component'

describe('TaskFormAutocompleteComponent', () => {
    let component: TaskFormAutocompleteComponent
    let fixture: ComponentFixture<TaskFormAutocompleteComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaskFormAutocompleteComponent,
            ],
            imports: [ReactiveFormsModule],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskFormAutocompleteComponent)
        component = fixture.componentInstance
        component.items = ['pro1', 'pro2']
        component.inputControl = new FormControl('')
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should highlight project', () => {
        component.items = ['pro1', 'pro2']
        component.inputControl.setValue('pro')
        component.isVisible = true
        expect(component.highlightedItem).toBeUndefined()
        component.navigate({key: 'ArrowDown'})
        expect(component.highlightedItem).toEqual('pro1')
        component.navigate({key: 'ArrowDown'})
        expect(component.highlightedItem).toEqual('pro2')
        component.navigate({key: 'ArrowDown'})
        expect(component.highlightedItem).toEqual('pro2')
        component.navigate({key: 'ArrowUp'})
        expect(component.highlightedItem).toEqual('pro1')
        component.navigate({key: 'ArrowUp'})
        expect(component.highlightedItem).toEqual('pro1')
    })
})
