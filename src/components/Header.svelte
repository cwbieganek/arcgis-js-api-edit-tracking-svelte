<script lang="ts">
	export let title: string = 'Application Title';
</script>

<div class='header'>
	<h3>{title}</h3>
	<div class='header-button-container-right'><button>Test</button></div>
</div>

<style>
	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 60px;
		/* background-color: var(--calcite-ui-foreground-3); */
		background-color: #242424;  /* This is the same as .esri-widget */
		color: var(--calcite-ui-text-1);
		padding: 0 1em;
	}

	.header-button-container-right {
		display: flex;
		flex: 1;
		justify-content: end;
		align-items: center;
	}
</style>