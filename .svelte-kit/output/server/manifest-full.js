export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".nojekyll","CNAME","audio/posts/2026-10-22-ai-factory-privacidade-por-arquitetura/intro.webm","audio/posts/2026-10-22-ai-factory-privacidade-por-arquitetura/manifest.json","audio/posts/2026-10-22-ai-factory-privacidade-por-arquitetura/sec-a-regra-de-ouro-sistemas-deterministicos-em-torno-de-modelos-pro.webm","backend-url.txt","favicon.svg","images/Artefatos para blog portfolio/.thumbnail","images/Artefatos para blog portfolio/Artefatos Portfolio.dc.html","images/Artefatos para blog portfolio/assets/avatar-1-office.png","images/Artefatos para blog portfolio/assets/avatar-2-selfie.png","images/Artefatos para blog portfolio/assets/avatar-3-pixel.png","images/Artefatos para blog portfolio/support.js","images/Artefatos para blog portfolio/uploads/pasted-1782404038855-0.png","images/Artefatos para blog portfolio/uploads/pasted-1782404269547-0.png","images/Artefatos para blog portfolio/uploads/pasted-1782404297754-0.png","images/Artefatos para blog portfolio.zip","images/avatar.svg","images/earth/earth_clouds_1k.webp","images/earth/earth_day_2k.webp","images/earth/earth_lights_2k.webp","images/earth/earth_normal_2k.webp","images/earth/earth_specular_2k.webp","images/earth/moon_1k.webp","images/galactic-sky-4k.webp","images/github-icon.svg","images/linkedin-icon.svg","images/portfolio-icon.svg","images/profile.jpg","images/profile.png","images/profile_light.jpg","images/profile_light.png","images/twitter-icon.svg","images/weboasis-icon.svg","images/youtube-icon.svg","posts/2026-01-07-dev-diary.pt.md","posts/2026-01-14-dev-diary.pt.md","posts/2026-01-21-dev-diary.pt.md","posts/2026-01-28-dev-diary.pt.md","posts/2026-02-04-dev-diary.pt.md","posts/2026-02-11-dev-diary.pt.md","posts/2026-02-18-dev-diary.pt.md","posts/2026-02-25-dev-diary.pt.md","posts/2026-03-04-dev-diary.pt.md","posts/2026-03-11-dev-diary.pt.md","posts/2026-03-18-dev-diary.pt.md","posts/2026-03-25-dev-diary.pt.md","posts/2026-04-01-dev-diary.pt.md","posts/2026-04-08-dev-diary.pt.md","posts/2026-04-15-dev-diary.pt.md","posts/2026-04-22-dev-diary.pt.md","posts/2026-04-29-dev-diary.pt.md","posts/2026-05-06-dev-diary.pt.md","posts/2026-05-13-dev-diary.pt.md","posts/2026-05-20-dev-diary.pt.md","posts/2026-05-27-dev-diary.pt.md","posts/2026-06-03-dev-diary.pt.md","posts/2026-06-06-retrospective.pt.md","posts/2026-06-12-fable5-report.pt.md","posts/2026-06-13-arquitetura-e-metodologia.en.md","posts/2026-06-13-arquitetura-e-metodologia.pt.md","posts/2026-06-13-dev-diary.pt.md","posts/2026-06-30-dev-diary-transition.pt.md","posts/2026-07-08-dev-diary-ark-streams.pt.md","posts/2026-10-22-ai-factory-privacidade-por-arquitetura.pt.md","posts/2026-10-22-dev-diary-retrospectiva-trimestral.pt.md","posts.json","vite.svg"]),
	mimeTypes: {".webm":"video/webm",".json":"application/json",".txt":"text/plain",".svg":"image/svg+xml",".html":"text/html",".png":"image/png",".js":"text/javascript",".zip":"application/zip",".webp":"image/webp",".jpg":"image/jpeg",".md":"text/markdown"},
	_: {
		client: {start:"_app/immutable/entry/start.DqGwe6Ut.js",app:"_app/immutable/entry/app.Bw5S9_wt.js",imports:["_app/immutable/entry/start.DqGwe6Ut.js","_app/immutable/chunks/DExq_8Op.js","_app/immutable/chunks/BDcDgluY.js","_app/immutable/entry/app.Bw5S9_wt.js","_app/immutable/chunks/BDcDgluY.js","_app/immutable/chunks/CsBtT9We.js","_app/immutable/chunks/Cl6kk3Vo.js","_app/immutable/chunks/1Zz2lLlO.js","_app/immutable/chunks/B9uAXGFw.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
