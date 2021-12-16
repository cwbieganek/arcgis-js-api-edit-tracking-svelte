<script lang='ts'>
	import WebMap from '@arcgis/core/WebMap';
	import MapView from '@arcgis/core/views/MapView';
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
	});
</script>

<div id='container' class='container'></div>