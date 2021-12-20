<script lang='ts'>
	import Map from '@arcgis/core/Map';
	import MapView from '@arcgis/core/views/MapView';
	import Expand from '@arcgis/core/widgets/Expand';
	import LayerList from '@arcgis/core/widgets/LayerList';
	import Editor from '@arcgis/core/widgets/Editor';
	import FeatureTable from '@arcgis/core/widgets/FeatureTable';
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
		console.log('Map component has mounted.');
		setupMapView();
	});

	// Creates Map, MapView, and adds widgets
	function setupMapView(): void {
		console.log('Setting up map view.');
		const map = new Map({
			basemap: basemap
		});

		// MapView is responsible for visualizing the Map and widgets, controlling zoom, extent, etc.
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
		
		// It might be better to add the layers after the view is ready, like the example below:
		// https://developers.arcgis.com/javascript/latest/sample-code/widgets-featuretable-editing/
		addLayers(map).then((featureLayers) => {
				console.log('Feature layer(s) added to the map.');
				let firstFeatureLayer = featureLayers[0];

				// Wait for FeatureLayerView to be ready for the first feature layer before showing MapView
				view.whenLayerView(firstFeatureLayer).then(() => {
					// Make firstFeatureLayer editable
					addEditorWidget(view, firstFeatureLayer);

					// Add editable FeatureTable widget for firstFeatureLayer
					addEditableFeatureTable(firstFeatureLayer, view, document.getElementById('feature-table') as HTMLDivElement);

					console.log('Revealing the map view.');
					loading = false;
				});
		});

		// Synchronously add widgets while layers are being added
		addWidgets(view, includeLegend);
	}

	// Adds widgets to the MapView. Only adds a LayerList with built-in Legend for now, and the location cannot be controlled.
	function addWidgets(view: MapView, includeLegend: boolean): void {
		console.log('Adding widgets.');
		if (includeLegend) {
			// Create LayerList with built-in Legend
			const layerList = new LayerList({
				view: view,
				listItemCreatedFunction: (event) => {
					const item = event.item;

					if (item.layer.type == 'group') { return; }

					// Don't show legend twice
					item.panel = {
						content: 'legend',
						open: true
					}
				}
			});

			// Create Expand widget for holding the Legend
			const expand = new Expand({
				view: view,
				content: layerList
			});

			// Add Legend to top right corner of view
			view.ui.add(expand, "top-right");
		}
	}

	// Adds an Editor widget for the one and only (for now) feature layer.
	// All fields will be editable by default since we don't pass any configuration information.
	function addEditorWidget(view: MapView, featureLayer: FeatureLayer): void {
		const editor = new Editor({
			view: view
		});

		// Create Expand widget for holding the legend
		const expand = new Expand({
			view: view,
			content: editor
		});

		view.ui.add(expand, "top-right");
	}

	function addEditableFeatureTable(featureLayer: FeatureLayer, view: MapView, container: HTMLDivElement) {
		// Create the feature table
		const featureTable = new FeatureTable({
				view: view,
				layer: featureLayer,
				editingEnabled: true,
				// Autocast the FieldColumnConfigs
				fieldConfigs: [{
					name: "Tree_ID",
					label: "Tree ID",
					editable: false,
					direction: "asc"
				},
				{
					name: "Collected",
					label: "Collected"
				},
				{
					name: "Crew",
					label: "Crew"
				},
				{
					name: "Status",
					label: "Status"
				},
				{
					name: "Arrest",
					label: "Arrest"
				}],
				container: container
			});
	}

	// Adds layers to the map. The layers that get added cannot be controlled for now.
	function addLayers(map: Map): Promise<FeatureLayer[]> {
		console.log('Adding feature layer(s) to map.');
		return new Promise((resolve, reject) => {
			const featureLayer = new FeatureLayer({
				url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
			});

			getClientSideCopyOfFeatureLayer(featureLayer).then((featureLayerClientSideCopy) => {
				console.log('Created client-side copy of feature layer.');
				map.add(featureLayerClientSideCopy);
				resolve([featureLayerClientSideCopy]);
			});
		});
	}

	// Makes a client-side copy of a FeatureLayer from an array of graphics
	// Useful for making an editable copy of a normally un-editable layer
	function getClientSideCopyOfFeatureLayer(featureLayer: FeatureLayer): Promise<FeatureLayer> {
		console.log('Creating client-side copy ');
		return new Promise((resolve, reject) => {
			let query = featureLayer.createQuery();
			query.where = '1 = 1';
			featureLayer.queryFeatures(query).then((featureSet) => {
				const graphics = featureSet.features;
				const featureLayerClientSideCopy = new FeatureLayer({
					source: graphics,
					fields: featureSet.fields,
					geometryType: featureLayer.geometryType,
					title: featureLayer.title,
					renderer: featureLayer.renderer
				});

				resolve(featureLayerClientSideCopy);
			});
		});
	}
</script>

{#if loading}
	<calcite-loader active type="indeterminate"></calcite-loader>
{/if}

<div id='container' class='container' style={loading ? 'visibility: hidden;' : ''}></div>
<div id='feature-table-container' class='container' style={loading ? 'visibility: hidden;' : ''}>
	<div id='feature-table'></div>
</div>

<style>
	#container {
		height: 75%;
		min-height: 50%;
	}

	#feature-table-container {
		height: 25%;
		max-height: 50%;
		/* resize: vertical;
		overflow: auto; */
	}
</style>