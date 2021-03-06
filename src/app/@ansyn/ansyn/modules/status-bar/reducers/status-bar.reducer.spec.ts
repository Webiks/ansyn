import { StatusBarInitialState, StatusBarReducer } from './status-bar.reducer';
import { UpdateGeoFilterStatus } from '../actions/status-bar.actions';
import { CaseGeoFilter } from '../../menu-items/cases/models/case.model';

describe('Status Bar Reducer', () => {
	let _reducerState;

	beforeEach(() => {
		_reducerState = Object.assign({}, StatusBarInitialState);
	});

	it('update geoFilter status', () => {
		const action = new UpdateGeoFilterStatus({ searchMode: CaseGeoFilter.PinPoint, indicator: true });
		const newState = StatusBarReducer(_reducerState, action);
		expect(newState.geoFilterStatus).toEqual({ searchMode: CaseGeoFilter.PinPoint, indicator: true });
	});
});
