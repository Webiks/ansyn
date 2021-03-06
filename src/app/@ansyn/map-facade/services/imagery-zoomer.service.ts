import { Injectable } from '@angular/core';
import { BaseImageryMap, ImageryCommunicatorService } from '@ansyn/imagery';

@Injectable({
	providedIn: 'root'
})
export class ImageryZoomerService {

	constructor(protected imageryCommunicatorService: ImageryCommunicatorService) {
	}

	getMap(mapId: string): BaseImageryMap {
		return this.imageryCommunicatorService.provide(mapId).ActiveMap
	}

	resetZoom(mapId: string): void {
		this.getMap(mapId).resetZoom();
	}

	zoomIn(mapId: string): void {
		this.getMap(mapId).zoomIn();
	}


	zoomOut(mapId: string): void {
		this.getMap(mapId).zoomOut();
	}
}
