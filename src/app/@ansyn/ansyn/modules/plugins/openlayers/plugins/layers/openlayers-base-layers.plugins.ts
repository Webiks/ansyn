import { Store } from '@ngrx/store';
import TileLayer from 'ol/layer/Tile';
import { tap } from 'rxjs/operators';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { BaseImageryPlugin } from '@ansyn/imagery';
import { selectDisplayLayersOnMap } from '@ansyn/map-facade';
import { AutoSubscription } from 'auto-subscriptions';
import { OpenLayersMap } from '@ansyn/ol';
import { ILayer } from '../../../../menu-items/layers-manager/models/layers.model';
import { selectLayers, selectSelectedLayersIds } from '../../../../menu-items/layers-manager/reducers/layers.reducer';

export abstract class OpenlayersBaseLayersPlugins extends BaseImageryPlugin {
	protected subscriptions: Subscription[] = [];

	osmLayersChanges$: Observable<any[]> = combineLatest(this.store$.select(selectLayers), this.store$.select(selectSelectedLayersIds))
		.pipe(
			tap(([result, selectedLayerId]: [ILayer[], string[]]) => {
				result.filter(this.checkLayer)
					.forEach((layer: ILayer) => {
						if (selectedLayerId.includes(layer.id)) {
							this.addGroupLayer(layer);
						} else {
							this.removeGroupLayer(layer.id);
						}
					});
			})
		);

	toggleGroup$ = this.store$.select(selectDisplayLayersOnMap(this.mapId)).pipe(
		tap((newState: boolean) => this.iMap.toggleGroup('layers', newState))
	);

	onInitSubscriptions(): void {
		super.onInitSubscriptions();
		this.subscriptions.push(
			this.toggleGroup$.subscribe(() => {
			}),
			this.osmLayersChanges$.subscribe(() => {
			})
		)
	}

	onDispose(): void {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
		this.subscriptions = [];
		super.onDispose();
	}

	protected constructor(protected store$: Store<any>) {
		super();
	}


	abstract checkLayer(layer: ILayer);

	abstract createLayer(layer: ILayer): Observable<TileLayer>;

	addGroupLayer(layer: ILayer) {
		const group = OpenLayersMap.groupLayers.get(OpenLayersMap.groupsKeys.layers);
		const layersArray = group.getLayers().getArray();
		if (!layersArray.some((shownLayer) => shownLayer.get('id') === layer.id)) {
			this.createLayer(layer).subscribe((tileLayer) => {
				const _layer = tileLayer;
				group.getLayers().push(_layer);
			});
		}
	}

	removeGroupLayer(id: string): void {
		const group = OpenLayersMap.groupLayers.get(OpenLayersMap.groupsKeys.layers);
		const layersArray: any[] = group.getLayers().getArray();
		let removeIdx = layersArray.indexOf(layersArray.find(l => l.get('id') === id));
		if (removeIdx >= 0) {
			group.getLayers().removeAt(removeIdx);
		}
	}

}
