// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

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
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/arbitusgateway/arbitus' },
			],
			editLink: {
				baseUrl: 'https://github.com/arbitusgateway/arbitus-site/edit/main/',
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
					label: 'Reference',
					items: [
						{ slug: 'docs/cli' },
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
