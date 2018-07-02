import { VisualizerStateStyle } from './visualizer-state';
import { Feature } from 'geojson';

export interface IVisualizerEntity {
	id: string;
	featureJson: Feature<any>;
	state?: 'static' | 'activeDisplad';
	type?: string,
	style?: Partial<VisualizerStateStyle>
}