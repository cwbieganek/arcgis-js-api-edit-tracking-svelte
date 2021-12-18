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
	// export let zoom: number = 4;

	let loading = true;

	onMount(async () => {
		setupMapView();
	});

	function setupMapView() {
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

		addLayers(map);
		addWidgets(view, includeLegend);

		view.when(() => {
			console.log('Revealing the map view.');
			loading = false;
		});
	}

	function addWidgets(view, includeLegend) {
		if (includeLegend) {
			// Add legend
			let legend = new Legend({
				view: view
			});

			// Add legend to bottom right corner of view
			view.ui.add(legend, "bottom-right");
		}
	}

	function addLayers(map) {
		const featureLayer = new FeatureLayer({
			url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
		});

		map.add(featureLayer);
	}

</script>

{#if loading}
	<calcite-loader active type="indeterminate"></calcite-loader>
{/if}

<div id='container' class='container' style={loading ? 'visibility: hidden;' : ''}></div>