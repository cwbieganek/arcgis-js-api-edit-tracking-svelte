<script lang="ts">
	export let title: string = 'Application Title';
</script>

<div class='calcite-theme-dark'>
	<h3>{title}</h3>
</div>

<style>
	div {
		display: flex;
		align-items: center;
		height: 60px;
		background-color: var(--calcite-ui-background);
		color: var(--calcite-ui-text-1);
	}
</style>