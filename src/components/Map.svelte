<script lang='ts'>
	import Map from '@arcgis/core/Map';
	import MapView from '@arcgis/core/views/MapView';
	import Legend from '@arcgis/core/widgets/Legend';
	import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
	import Extent from '@arcgis/core/geometry/Extent';
	import { onMount } from 'svelte';

	type BasemapTypeNoTokenRequired = 
	'topo-vector' |  // World Hillshade and World Topographic Map V2 (no API key needed)
	'hybrid'         // World Boundaries and Place and World Imager (no API key needed)

	type BasemapTypeTokenRequired = 
	'arcgis-imagery' |           // Imagery Hybrid
	'arcgis-imagery-standard' |  // Imagery
	'arcgis-imagery-labels'      // The reference layer from arcgis-imagery

	export let includeLegend: boolean = false;
	export let basemap: BasemapTypeNoTokenRequired = 'topo-vector';  // Default to topo-vector

	let loading = true;  // Controls the visibility of the loading component and the map

	// Wait for component to be mounted before calling setupMapView()
	// This is necessary because the #container element will not exist until the component mounts.
	onMount(async () => {
		setupMapView();
	});

	// Creates Map, MapView, and adds widgets
	function setupMapView(): void {
		const map = new Map({
			basemap: basemap
		});

		const view = new MapView({
			map: map,
			container: 'container',
			extent: new Extent({
				xmin: -9177811,
				ymin: 4247000,
				xmax: -9176791,
				ymax: 4247784,
				spatialReference: { wkid: 102100 }
			})
		});

		let firstFeatureLayer: FeatureLayer = addLayers(map)[0];
		addWidgets(view, includeLegend);

		// Wait for FeatureLayerView to be ready for the first feature layer before showing MapView
		view.whenLayerView(firstFeatureLayer).then(() => {
			console.log('Revealing the map view.');
			loading = false;
		});
	}

	// Adds widgets to the MapView. Only adds a legend for now, and the location cannot be controlled.
	function addWidgets(view: MapView, includeLegend: boolean): void {
		if (includeLegend) {
			// Add legend
			let legend = new Legend({
				view: view
			});

			// Add legend to bottom right corner of view
			view.ui.add(legend, "bottom-right");
		}
	}

	// Adds layers to the map. The layers that get added cannot be controlled for now.
	function addLayers(map: Map): FeatureLayer[] {
		const featureLayer = new FeatureLayer({
			url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
		});

		map.add(featureLayer);

		return [featureLayer];
	}

	// Makes a client-side copy of a FeatureLayer from an array of graphics
	// Useful for making an editable copy of a normally un-editable layer
	function getClientSideCopyOfFeatureLayer(featureLayer: FeatureLayer): void {
		return;
	}

</script>

{#if loading}
	<calcite-loader active type="indeterminate"></calcite-loader>
{/if}

<div id='container' class='container' style={loading ? 'visibility: hidden;' : ''}></div>