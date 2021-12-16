<script lang='ts'>
	import WebMap from '@arcgis/core/WebMap';
	import MapView from '@arcgis/core/views/MapView';
	import Legend from '@arcgis/core/widgets/Legend';
	import { onMount } from 'svelte';

	onMount(async () => {
		const webmap = new WebMap({
			portalItem: {
				id: "e691172598f04ea8881cd2a4adaa45ba"
			}
		});

		const view = new MapView({
			map: webmap,
			container: 'container'
		});

		// Add legend
		let legend = new Legend({
  		view: view
		});

		// Add legend to bottom right corner of view
		view.ui.add(legend, "bottom-right");
	});
</script>

<div id='container' class='container'></div>