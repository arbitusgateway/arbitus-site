// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { aeoAstroIntegration } from 'aeo.js/astro';

export default defineConfig({
	site: 'https://arbitus-gateway.xyz',
	integrations: [
		starlight({
			title: 'Arbitus',
			logo: {
				src: './src/assets/arbitus-logo.png',
				alt: 'Arbitus',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/nfvelten/arbitus' },
			],
			editLink: {
				baseUrl: 'https://github.com/nfvelten/arbitus-site/edit/main/',
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ slug: 'docs/getting-started' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ slug: 'docs/configuration' },
						{ slug: 'docs/usage' },
						{ slug: 'docs/deployment' },
						{ slug: 'docs/security' },
					],
				},
				{
					label: 'Advanced',
					items: [
						{ slug: 'docs/audit' },
						{ slug: 'docs/observability' },
						{ slug: 'docs/architecture' },
					],
				},
			],
			customCss: ['./src/styles/global.css'],
			head: [
				{
					tag: 'script',
					attrs: {
						defer: true,
						src: 'https://static.cloudflareinsights.com/beacon.min.js',
						'data-cf-beacon': '{"token": ""}',
					},
				},
			],
		}),
		aeoAstroIntegration({
			title: 'Arbitus',
			description: 'The security proxy for AI agents and MCP servers',
			url: 'https://arbitus-gateway.xyz',
			schema: {
				enabled: true,
				organization: {
					name: 'Arbitus',
					url: 'https://arbitus-gateway.xyz',
					logo: 'https://arbitus-gateway.xyz/arbitus-logo.png',
				},
			},
		}),
	],
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			wrap: true,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
