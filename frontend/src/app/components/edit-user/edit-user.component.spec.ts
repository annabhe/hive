import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserComponent } from './edit-user.component'

describe('EditUserComponenet', () => {
    let component: EditUserComponent;
    let fixture: ComponentFixture<EditUserComponent>


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ EditUserComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
})