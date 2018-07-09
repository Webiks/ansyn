import { OpenLayersMap } from '@ansyn/plugins/openlayers/open-layers-map/openlayers-map/openlayers-map';
import { Store } from '@ngrx/store';
import { ILayer, layerPluginType } from '@ansyn/menu-items/layers-manager/models/layers.model';
import OSM from 'ol/source/osm';
import TileLayer from 'ol/layer/tile';
import { selectLayers, selectSelectedLayersIds } from '@ansyn/menu-items/layers-manager/reducers/layers.reducer';
import { filter, map, tap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { BaseImageryPlugin } from '@ansyn/imagery/model/base-imagery-plugin';
import { selectMapsList } from '@ansyn/map-facade/reducers/map.reducer';
import { MapFacadeService } from '@ansyn/map-facade/services/map-facade.service';
import { CaseMapState } from '@ansyn/core/models/case.model';
import { distinctUntilChanged } from 'rxjs/internal/operators';
import { ImageryPlugin } from '@ansyn/imagery/model/decorators/imagery-plugin';


@ImageryPlugin({
	supported: [OpenLayersMap],
	deps: [Store]
})
export class OpenlayersOsmLayersPlugin extends BaseImageryPlugin {

	toggleGroup$ = this.store$.select(selectMapsList).pipe(
		map((mapsList) => MapFacadeService.mapById(mapsList, this.mapId)),
		filter(Boolean),
		map((map: CaseMapState) => !map.flags.displayLayers),
		distinctUntilChanged(),
		tap((newState: boolean) => this.iMap.toggleGroup('layers', newState))
	);

	osmLayersChanges$: Observable<any[]> = combineLatest(this.store$.select(selectLayers), this.store$.select(selectSelectedLayersIds))
		.pipe(
			tap(([result, selectedLayerId]: [ILayer[], string[]]) => {
				result.filter(this.isOSMlayer)
					.forEach((layer: ILayer) => {
						if (selectedLayerId.includes(layer.id)) {
							this.addGroupLayer(layer);
						} else {
							this.removeGroupLayer(layer.id);
						}
					});
			})
		);

	constructor(protected store$: Store<any>) {
		super();
	}

	isOSMlayer(layer: ILayer) {
		return layer.layerPluginType === layerPluginType.OSM;
	}

	createOSMLayer(layer: ILayer): TileLayer {
		const vector = new TileLayer({
			zIndex: 100,
			source: new OSM({
				attributions: [
					layer.name
				],
				opaque: false,
				url: layer.url,
				crossOrigin: null
			})
		});
		vector.set('id', layer.id);
		return vector;
	}

	addGroupLayer(layer: ILayer) {
		const group = OpenLayersMap.groupLayers.get('layers');
		const layersArray = group.getLayers().getArray();
		if (!layersArray.some((shownLayer) => shownLayer.get('id') === layer.id)) {
			if (!group) {
				throw new Error('Tried to add a layer to a non-existent group');
			}
			const osmLayer = this.createOSMLayer(layer);
			group.getLayers().push(osmLayer);
		}
	}

	removeGroupLayer(id: string): void {
		const group = OpenLayersMap.groupLayers.get('layers');
		if (!group) {
			throw new Error('Tried to remove a layer to a non-existent group');
		}

		const layersArray: any[] = group.getLayers().getArray();
		let removeIdx = layersArray.indexOf(layersArray.find(l => l.get('id') === id));
		if (removeIdx >= 0) {
			group.getLayers().removeAt(removeIdx);
		}
	}

	onInit() {
		super.onInit();
		this.subscriptions.push(
			this.osmLayersChanges$.subscribe(),
			this.toggleGroup$.subscribe()
		);
	}
}