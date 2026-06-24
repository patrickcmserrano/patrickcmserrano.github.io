export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".nojekyll","CNAME","images/avatar.svg","images/github-icon.svg","images/linkedin-icon.svg","images/portfolio-icon.svg","images/profile.jpg","images/profile_backup2.jpg","images/twitter-icon.svg","images/weboasis-icon.svg","images/youtube-icon.svg","posts/2026-01-07-dev-diary.pt.md","posts/2026-01-14-dev-diary.pt.md","posts/2026-01-21-dev-diary.pt.md","posts/2026-01-28-dev-diary.pt.md","posts/2026-02-04-dev-diary.pt.md","posts/2026-02-11-dev-diary.pt.md","posts/2026-02-18-dev-diary.pt.md","posts/2026-02-25-dev-diary.pt.md","posts/2026-03-04-dev-diary.pt.md","posts/2026-03-11-dev-diary.pt.md","posts/2026-03-18-dev-diary.pt.md","posts/2026-03-25-dev-diary.pt.md","posts/2026-04-01-dev-diary.pt.md","posts/2026-04-08-dev-diary.pt.md","posts/2026-04-15-dev-diary.pt.md","posts/2026-04-22-dev-diary.pt.md","posts/2026-04-29-dev-diary.pt.md","posts/2026-05-06-dev-diary.pt.md","posts/2026-05-13-dev-diary.pt.md","posts/2026-05-20-dev-diary.pt.md","posts/2026-05-27-dev-diary.pt.md","posts/2026-06-03-dev-diary.pt.md","posts/2026-06-06-retrospective.pt.md","posts/2026-06-12-fable5-report.pt.md","posts/2026-06-13-arquitetura-e-metodologia.en.md","posts/2026-06-13-arquitetura-e-metodologia.pt.md","posts/2026-06-13-dev-diary.pt.md","posts.json","vite.svg"]),
	mimeTypes: {".svg":"image/svg+xml",".jpg":"image/jpeg",".md":"text/markdown",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.QFDqzsvO.js",app:"_app/immutable/entry/app.CtHfeq9r.js",imports:["_app/immutable/entry/start.QFDqzsvO.js","_app/immutable/chunks/CncKAg6x.js","_app/immutable/chunks/8NYM_yIc.js","_app/immutable/chunks/x3pvDTcy.js","_app/immutable/entry/app.CtHfeq9r.js","_app/immutable/chunks/8NYM_yIc.js","_app/immutable/chunks/DovrcI9r.js","_app/immutable/chunks/B3y-Ydai.js","_app/immutable/chunks/BNHmZo67.js","_app/immutable/chunks/x3pvDTcy.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/blog",
				pattern: /^\/blog\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/blog/[slug]",
				pattern: /^\/blog\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/links",
				pattern: /^\/links\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/trabalho",
				pattern: /^\/trabalho\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/trabalho/[slug]",
				pattern: /^\/trabalho\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
