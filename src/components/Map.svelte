<script lang='ts'>
	import WebMap from '@arcgis/core/WebMap';
	import MapView from '@arcgis/core/views/MapView';
	import Legend from '@arcgis/core/widgets/Legend';
	import { onMount } from 'svelte';

	export let include_legend: boolean = false;
	export let zoom: number = 4;

	let loading = true;

	onMount(async () => {
		setupMapView();
	});

	function setupMapView() {
		const webmap = new WebMap({
			portalItem: {
				id: "e691172598f04ea8881cd2a4adaa45ba"
			}
		});

		const view = new MapView({
			map: webmap,
			container: 'container',
			zoom: zoom
		});

		if (include_legend) {
			// Add legend
			let legend = new Legend({
				view: view
			});

			// Add legend to bottom right corner of view
			view.ui.add(legend, "bottom-right");
		}

		view.when(() => {
			setTimeout(() => {
				console.log('Revealing the map view.');
				loading = false;
			}, 3000);
		});
	}

</script>

<div id='container' class='container' style={loading ? 'visibility: hidden;' : ''}></div>