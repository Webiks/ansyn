import { EnumFilterMetadata } from '../../models/metadata/enum-filter-metadata';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SortPipe } from '../../pipes/sort.pipe';
import { MapIteratorPipe } from '../../pipes/map-iterator.pipe';
import { EnumFilterContainerComponent } from './enum-filter-container.component';
import { TranslateModule } from '@ngx-translate/core';
import { ShowMorePipe } from '../../pipes/show-more.pipe';
import { FilterCounterComponent } from '../filter-counter/filter-counter.component';
import { filtersConfig } from '../../services/filters.service';
import { FormsModule } from '@angular/forms';
import { AnsynCheckboxComponent } from '../../../../core/forms/ansyn-checkbox/ansyn-checkbox.component';

describe('EnumFilterContainerComponent', () => {
	let component: EnumFilterContainerComponent;
	let fixture: ComponentFixture<EnumFilterContainerComponent>;

	beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [TranslateModule.forRoot(), FormsModule],
				declarations: [EnumFilterContainerComponent, SortPipe, MapIteratorPipe, ShowMorePipe, FilterCounterComponent, AnsynCheckboxComponent],
				providers: [{ provide: filtersConfig, useValue: {} }]
			}).compileComponents();
		}
	));

	beforeEach(() => {
		fixture = TestBed.createComponent(EnumFilterContainerComponent);
		component = fixture.componentInstance;
		component.metadata = new EnumFilterMetadata();
		// component
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
