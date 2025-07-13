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

<main class="container">
	<!-- Hero Section -->
	<section class="hero">
		<div class="hero-content">
			<h1>Olá, eu sou Fulano</h1>
			<p class="subtitle">Desenvolvedor Backend com foco em soluções robustas e escaláveis.</p>
			<a href="#contact" role="button">Entre em Contato</a>
		</div>
	</section>

	<!-- About Me Section -->
	<section id="about">
		<h2>Sobre Mim</h2>
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
	</section>

	<!-- Skills Section -->
	<section id="skills">
		<h2>Habilidades</h2>
		<div class="grid">
			<article>
				<h3>Linguagens</h3>
				<ul>
					<li>Python</li>
					<li>Java</li>
					<li>Go</li>
					<li>Node.js</li>
				</ul>
			</article>
			<article>
				<h3>Frameworks & Ferramentas</h3>
				<ul>
					<li>Django / Flask</li>
					<li>Spring Boot</li>
					<li>Docker / Kubernetes</li>
					<li>SQL / NoSQL Databases</li>
				</ul>
			</article>
			<article>
				<h3>Cloud & DevOps</h3>
				<ul>
					<li>AWS / GCP / Azure</li>
					<li>CI/CD</li>
					<li>Git</li>
					<li>Linux</li>
				</ul>
			</article>
		</div>
	</section>

	<!-- Projects Section -->
	<section id="projects">
		<h2>Projetos</h2>
		<div class="grid">
			<article>
				<h3>Projeto 1</h3>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				<a href="#" role="button" class="secondary">Ver Projeto</a>
			</article>
			<article>
				<h3>Projeto 2</h3>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				<a href="#" role="button" class="secondary">Ver Projeto</a>
			</article>
			<article>
				<h3>Projeto 3</h3>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				<a href="#" role="button" class="secondary">Ver Projeto</a>
			</article>
		</div>
	</section>

	<!-- Contact Section -->
	<section id="contact">
		<h2>Contato</h2>
		<p>Interessado em trabalhar juntos? Entre em contato!</p>
		<form>
			<div class="grid">
				<input type="text" name="name" placeholder="Seu Nome" aria-label="Seu Nome" required>
				<input type="email" name="email" placeholder="Seu Email" aria-label="Seu Email" required>
			</div>
			<textarea name="message" placeholder="Sua Mensagem" aria-label="Sua Mensagem" rows="5" required></textarea>
			<button type="submit">Enviar Mensagem</button>
		</form>
	</section>
</main>

<div class="secret-corner" on:click={() => window.location.href='/stats'}></div>

<style>
	.hero {
		background: linear-gradient(to right, #3498db, #8e44ad);
		color: white;
		text-align: center;
		padding: 8rem 0;
		margin-bottom: 2rem;
		border-radius: var(--pico-border-radius);
		box-shadow: var(--pico-card-box-shadow);
	}

	.hero h1 {
		font-size: 3.5rem;
		margin-bottom: 1rem;
	}

	.hero .subtitle {
		font-size: 1.5rem;
		margin-bottom: 2rem;
		opacity: 0.9;
	}

	.hero a[role="button"] {
		background-color: var(--pico-primary-inverse);
		color: var(--pico-primary-background);
		border: none;
		padding: 0.8rem 2rem;
		font-size: 1.1rem;
		border-radius: var(--pico-border-radius);
		transition: background-color 0.2s ease;
	}

	.hero a[role="button"]:hover {
		background-color: #ecf0f1;
	}

	section {
		padding: 4rem 0;
		margin-bottom: 2rem;
		background-color: var(--pico-background-color);
		border-radius: var(--pico-border-radius);
		box-shadow: var(--pico-card-box-shadow);
		padding: 2rem;
	}

	section h2 {
		text-align: center;
		margin-bottom: 3rem;
		font-size: 2.5rem;
		color: var(--pico-primary);
	}

	#skills .grid article {
		text-align: center;
		padding: 1.5rem;
		background-color: var(--pico-card-background-color);
		border-radius: var(--pico-border-radius);
		box-shadow: var(--pico-card-box-shadow);
	}

	#skills ul {
		list-style: none;
		padding: 0;
		margin-top: 1rem;
	}

	#skills li {
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
	}

	#projects .grid article {
		padding: 1.5rem;
		background-color: var(--pico-card-background-color);
		border-radius: var(--pico-border-radius);
		box-shadow: var(--pico-card-box-shadow);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	#projects .grid article h3 {
		margin-top: 0;
		color: var(--pico-primary);
	}

	#projects .grid article a[role="button"] {
		margin-top: 1rem;
		align-self: flex-start;
	}

	#contact form {
		max-width: 600px;
		margin: 0 auto;
	}

	#contact input, #contact textarea {
		margin-bottom: 1rem;
	}

	.secret-corner {
		position: fixed;
		bottom: 0;
		right: 0;
		width: 20px;
		height: 20px;
		background-color: transparent; /* Torna-o invisível */
		cursor: pointer;
		z-index: 1000; /* Garante que esteja acima de outros elementos */
	}
</style>