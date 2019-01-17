import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoveTaskModalComponent } from './remove-task-modal.component';
import { FormsModule } from '@angular/forms';
import { AnsynInputComponent } from '@ansyn/core';
import { MatFormField } from '@angular/material';

describe('RemoveTaskModalComponent', () => {
	let component: RemoveTaskModalComponent;
	let fixture: ComponentFixture<RemoveTaskModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [RemoveTaskModalComponent, AnsynInputComponent, MatFormField]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RemoveTaskModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('onSubmit should emit value', () => {
		spyOn(component.submit, 'emit');
		component.onSubmit(true);
		expect(component.submit.emit).toHaveBeenCalledWith(true);
	});
});
