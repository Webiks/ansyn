import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { IAppState } from '../../';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { FiltersService, UpdateCaseAction } from '@ansyn/menu-items';
import { Case } from '@ansyn/core';
import { StatusBarActionsTypes } from '@ansyn/status-bar';
import { facetChangesActionType } from '@ansyn/menu-items/filters/effects/filters.effects';
import { CoreActionTypes } from '@ansyn/core/actions/core.actions';
import { LayersActionTypes } from '@ansyn/menu-items/layers-manager/actions/layers.actions';
import { MapActionTypes } from '@ansyn/map-facade';

export const UpdateCaseActionTypes = [
	...facetChangesActionType, // -> facets
	CoreActionTypes.SET_FAVORITE_OVERLAYS, // -> favoriteOverlays
	StatusBarActionsTypes.SET_COMBOBOXES_PROPERTIES, // -> geoFilter, timeFilter, orientation
	...Object.values(LayersActionTypes.ANNOTATIONS), // -> annotationsLayer, displayAnnotationsLayer
	MapActionTypes.STORE.SET_MAPS_DATA, // -> maps: activeMapId, data
	CoreActionTypes.SET_LAYOUT, // -> maps: layoutIndex
	CoreActionTypes.SET_OVERLAYS_CRITERIA // -> time, region
];


@Injectable()
export class UpdateCaseAppEffects {

	/**
	 * @type Effect
	 * @name caseCollection$
	 * @ofType [...UpdateCaseActionTypes]
	 * @action UpdateCaseAction
	 * @dependencies cases, core, tools, statusBar, map, layers, filters
	 */
	@Effect()
	caseCollection$: Observable<any> = this.actions$
		.ofType<Action>(...UpdateCaseActionTypes)
		.withLatestFrom(this.store$)
		.map(([action, { cases, core, tools, statusBar, map, layers, filters }]: [Action, IAppState]) => {
			// properties that should have been saved on another store ( not cases )
			let { contextEntities, selectedContextId, overlaysManualProcessArgs, facets } = cases.selectedCase.state;
			const { id, name, lastModified, owner } = cases.selectedCase;
			const { geoFilter, timeFilter, orientation } = statusBar.comboBoxesProperties;
			const { activeMapId, mapsList } = map;
			const { annotationsLayer, displayAnnotationsLayer } = layers;
			const { favoriteOverlays, overlaysCriteria, layout } = core;
			const { time, region } = overlaysCriteria;
			if (facetChangesActionType.includes(action.type)) {
				facets = FiltersService.buildCaseFacets(filters);
			}

			const updatedCase: Case = {
				id,
				name,
				lastModified,
				owner,
				state: {
					geoFilter,
					timeFilter,
					orientation,
					maps: {
						layout,
						data: mapsList,
						activeMapId
					},
					layers: {
						annotationsLayer,
						displayAnnotationsLayer
					},
					favoriteOverlays,
					region,
					time,
					facets,
					contextEntities,
					selectedContextId,
					overlaysManualProcessArgs
				}
			};

			return new UpdateCaseAction(updatedCase);
		}).share();

	constructor(protected actions$: Actions,
				protected store$: Store<IAppState>) {
	}
}