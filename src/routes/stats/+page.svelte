<script>
	import { onMount, tick } from 'svelte';
	import Chart from 'chart.js/auto';
	import { UAParser } from 'ua-parser-js';

	let allVisits = [];
	let filteredVisits = [];

	let totalVisits = 0;
	let uniqueVisitors = 0;

	let chart;
	let chartCanvas;

	let selectedMonth = new Date().getMonth() + 1;
	let selectedYear = new Date().getFullYear();
	let showBots = false;

	// Pagination state
	let currentPage = 1;
	let itemsPerPage = 10;
	$: totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
	$: paginatedVisits = filteredVisits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	// When itemsPerPage changes, reset to page 1
	$: if (itemsPerPage) currentPage = 1;

	// Logic to generate pagination buttons
	$: paginationButtons = ((currentPage, totalPages) => {
		const delta = 1; // how many pages to show around the current page
		const range = [];
		for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
			range.push(i);
		}
		if (currentPage - delta > 2) {
			range.unshift('...');
		}
		if (currentPage + delta < totalPages - 1) {
			range.push('...');
		}
		range.unshift(1);
		if (totalPages > 1) {
			range.push(totalPages);
		}
		return range;
	})(currentPage, totalPages);

	const months = [
		{ value: 1, name: 'Janeiro' }, { value: 2, name: 'Fevereiro' }, { value: 3, name: 'Março' },
		{ value: 4, name: 'Abril' }, { value: 5, name: 'Maio' }, { value: 6, name: 'Junho' },
		{ value: 7, name: 'Julho' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Setembro' },
		{ value: 10, name: 'Outubro' }, { value: 11, name: 'Novembro' }, { value: 12, name: 'Dezembro' }
	];

	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

	async function fetchData() {
		const res = await fetch('/api/visits');
		const data = await res.json();
		allVisits = data.visits.map((v) => {
			const parser = new UAParser(v.userAgent);
			return { ...v, ...parser.getResult() };
		});
		applyFilters();
	}

	async function applyFilters() {
		await tick();
		currentPage = 1;

		const visitsToProcess = allVisits.filter(v => showBots || !v.isBot);

		filteredVisits = visitsToProcess.filter((v) => {
			const date = new Date(v.datetime);
			return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
		});

		totalVisits = visitsToProcess.length;
		uniqueVisitors = new Set(visitsToProcess.map(v => v.visitorId)).size;

		updateChart();
	}

	function updateChart() {
		if (chart) chart.destroy();

		const visitsByDay = filteredVisits.reduce((acc, v) => {
			const day = new Date(v.datetime).getDate();
			acc[day] = (acc[day] || 0) + 1;
			return acc;
		}, {});

		const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
		const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
		const data = labels.map((day) => visitsByDay[day] || 0);

		chart = new Chart(chartCanvas, {
			type: 'bar',
			data: { labels, datasets: [{ label: 'Visitas por Dia', data, backgroundColor: '#3498db' }] }
		});
	}

	onMount(fetchData);
</script>

<main class="container">
	<header>
		<h1>Dashboard de Visitas</h1>
		<p>Análise de tráfego do seu site.</p>
	</header>

	<div class="grid">
		<article>
			<header>Total de Visitas</header>
			<h2>{totalVisits}</h2>
		</article>
		<article>
			<header>Visitantes Únicos</header>
			<h2>{uniqueVisitors}</h2>
		</article>
	</div>

	<section>
		<h2>Visão Geral das Visitas</h2>
		<div class="grid">
			<select bind:value={selectedMonth} on:change={applyFilters}>
				{#each months as month}
					<option value={month.value}>{month.name}</option>
				{/each}
			</select>
			<select bind:value={selectedYear} on:change={applyFilters}>
				{#each years as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
			<fieldset>
				<label for="switch">
					<input type="checkbox" id="switch" name="switch" role="switch" bind:checked={showBots} on:change={applyFilters}>
					Incluir Robôs
				</label>
			</fieldset>
		</div>
		<canvas bind:this={chartCanvas}></canvas>
	</section>

	<section>
		<h2>Últimas Visitas (Mês Selecionado)</h2>
		<div class="overflow-auto">
			<table>
				<thead>
					<tr>
						<th>País</th>
						<th>Cidade</th>
						<th>Navegador</th>
						<th>Sistema</th>
						<th>Data</th>
					</tr>
				</thead>
				<tbody>
					{#each paginatedVisits as visit}
						<tr>
							<td>{visit.isBot ? '🤖' : ''} {visit.country}</td>
							<td>{visit.city}</td>
							<td>{visit.browser.name} {visit.browser.version}</td>
							<td>{visit.os.name} {visit.os.version}</td>
							<td>{new Date(visit.datetime).toLocaleString()}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<footer class="pagination-footer">
			<div class="items-per-page">
				<label for="items-per-page-select">Itens por página:</label>
				<select id="items-per-page-select" bind:value={itemsPerPage}>
					<option value={10}>10</option>
					<option value={25}>25</option>
					<option value={50}>50</option>
				</select>
			</div>
			<nav aria-label="Pagination navigation">
				<div role="group">
					<button class="secondary outline" disabled={currentPage <= 1} on:click={() => currentPage--}>Anterior</button>
					{#each paginationButtons as page}
						{#if typeof page === 'number'}
							<button class:contrast={currentPage === page} on:click={() => currentPage = page}>{page}</button>
						{:else}
							<button disabled>...</button>
						{/if}
					{/each}
					<button class="secondary outline" disabled={currentPage >= totalPages} on:click={() => currentPage++}>Próximo</button>
				</div>
			</nav>
		</footer>
	</section>
</main>

<style>
	main.container {
		padding-top: 1.5rem;
		padding-bottom: 1.5rem;
	}

	header h1 {
		margin-bottom: 0;
	}

	header p {
		margin-top: 0.25rem;
	}

	.grid > article {
		padding: 1rem;
	}

	article h2 {
		font-size: 2.25rem;
		margin-bottom: 0;
	}

	section {
		margin-top: 2rem;
	}

	canvas {
		max-height: 300px;
		margin-top: 1rem;
	}

	table td,
	table th {
		padding: 0.5rem 0.75rem;
	}

	.pagination-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
	}

	.items-per-page {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.items-per-page label {
		margin-bottom: 0;
	}

	.items-per-page select {
		width: auto;
	}

	[role="group"] button {
		margin: 0;
		/* Make buttons smaller to feel more like pagination controls */
		padding: 0.4rem 0.8rem;
		font-size: 0.875em;
	}

	.items-per-page select {
		padding-top: 0.4rem;
		padding-bottom: 0.4rem;
		font-size: 0.875em;
	}

	/* Pico.css uses the 'contrast' class for a high-contrast button, perfect for 'active' state */
	button.contrast {
		background-color: var(--pico-primary-background);
		color: var(--pico-primary-inverse);
	}
</style>