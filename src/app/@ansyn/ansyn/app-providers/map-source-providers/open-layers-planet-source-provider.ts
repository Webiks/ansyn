import { BaseMapSourceProvider } from '@ansyn/imagery/index';
import XYZ from 'ol/source/xyz';
import ImageLayer from 'ol/layer/image';
import { OpenlayersMapName, ProjectableRaster } from '@ansyn/plugins/openlayers/open-layers-map';
import { Injectable } from '@angular/core';
import { Overlay } from '@ansyn/core/index';
import { extentFromGeojson } from '@ansyn/core/utils/index';
import proj from 'ol/proj';

export const OpenLayerPlanetSourceProviderMapType = OpenlayersMapName;
export const OpenLayerPlanetSourceProviderSourceType = 'PLANET';

@Injectable()
export class OpenLayerPlanetSourceProvider extends BaseMapSourceProvider {

	public mapType = OpenLayerPlanetSourceProviderMapType;
	public sourceType = OpenLayerPlanetSourceProviderSourceType;

	create(metaData: Overlay): any[] {
		const source = new XYZ({
			url: metaData.imageUrl,
			crossOrigin: 'Anonymous',
			projection: 'EPSG:3857'
		});


		let [x, y, x1, y1] = extentFromGeojson(metaData.footprint);
		[x, y] = proj.transform([x, y], 'EPSG:4326', 'EPSG:3857');
		[x1, y1] = proj.transform([x1, y1], 'EPSG:4326', 'EPSG:3857');

		return [new ImageLayer({
			source: new ProjectableRaster({
				sources: [source],
				operation: (pixels) => pixels[0],
				operationType: 'image'
			}),
			extent: [x, y, x1, y1]
		})];
	}

	createAsync(metaData: any): Promise<any> {
		let layer = this.createOrGetFromCache(metaData);
		return Promise.resolve(layer[0]);
	}
}
