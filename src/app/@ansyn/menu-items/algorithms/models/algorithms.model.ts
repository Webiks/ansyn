import { IEntity, IOverlay } from '@ansyn/core';
import { GeometryObject } from 'geojson';

export const AlgorithmsConfig = 'algorithmsConfig';

export interface IAlgorithmConfig {
	maxOverlays: number,
	timeEstimationPerOverlayInMinutes: number,
	regionLengthInMeters: number,
	sensorNames: string[]
}

export interface IAlgorithmsConfig {
	[algName: string]: IAlgorithmConfig
}

export type AlgorithmTaskWhichOverlays = 'case_overlays' | 'favorite_overlays' | 'displayed_overlays';

export type AlgorithmTaskStatus = 'New' | 'Sent';

export interface IAlgorithm extends IEntity {
	name: string;
}

export class AlgorithmTask {
	id: string;
	name: string;
	overlays: IOverlay[];
	masterOverlay: IOverlay;
	region: GeometryObject;
}