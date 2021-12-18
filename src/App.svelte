<script lang="ts">
	import Header from "./components/Header.svelte";
	import Map from "./components/Map.svelte";
</script>

<main class='calcite-theme-dark container'>
	<Header title='ArcGIS API for JavaScript with Edit Tracking (Built using Svelte)' />
	<Map includeLegend={true} basemap={'arcgis-imagery'} />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		text-align: center;
		padding: 0;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>