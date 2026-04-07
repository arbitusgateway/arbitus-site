import { defineConfig } from 'aeo.js';

export default defineConfig({
	title: 'Arbitus',
	url: 'https://arbitus-gateway.xyz',
	description: 'The security proxy for AI agents and MCP servers. Open-source security proxy that enforces per-agent policies — auth, rate limiting, payload filtering, and audit — before any tool call reaches your MCP server.',

	generators: {
		robotsTxt: true,
		llmsTxt: true,
		llmsFullTxt: true,
		rawMarkdown: true,
		sitemap: true,
		aiIndex: true,
		schema: true,
	},

	schema: {
		enabled: true,
		organization: {
			name: 'Arbitus',
			url: 'https://arbitus-gateway.xyz',
			logo: 'https://arbitus-gateway.xyz/arbitus-logo.png',
			sameAs: [
				'https://github.com/arbitusgateway/arbitus',
			],
		},
		defaultType: 'SoftwareApplication',
	},

	widget: {
		enabled: false, // Disabled for now
	},

	og: {
		enabled: true,
		image: 'https://arbitus-gateway.xyz/arbitus-logo.png',
		twitterHandle: '@arbitus',
	},
});