<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<script>
	import { onMount } from 'svelte';

	onMount(async () => {
		try {
			await fetch('/api/log-visit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});
		} catch (e) {
			console.error('Erro ao registrar acesso:', e);
		}
	});
</script>

