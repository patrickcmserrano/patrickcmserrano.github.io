export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".nojekyll","CNAME","backend-url.txt","favicon.svg","images/Artefatos para blog portfolio/.thumbnail","images/Artefatos para blog portfolio/Artefatos Portfolio.dc.html","images/Artefatos para blog portfolio/assets/avatar-1-office.png","images/Artefatos para blog portfolio/assets/avatar-2-selfie.png","images/Artefatos para blog portfolio/assets/avatar-3-pixel.png","images/Artefatos para blog portfolio/support.js","images/Artefatos para blog portfolio/uploads/pasted-1782404038855-0.png","images/Artefatos para blog portfolio/uploads/pasted-1782404269547-0.png","images/Artefatos para blog portfolio/uploads/pasted-1782404297754-0.png","images/Artefatos para blog portfolio.zip","images/avatar.svg","images/galactic-sky-4k.webp","images/github-icon.svg","images/linkedin-icon.svg","images/portfolio-icon.svg","images/profile.jpg","images/profile.png","images/profile_light.jpg","images/profile_light.png","images/twitter-icon.svg","images/weboasis-icon.svg","images/youtube-icon.svg","posts/2026-01-07-dev-diary.pt.md","posts/2026-01-14-dev-diary.pt.md","posts/2026-01-21-dev-diary.pt.md","posts/2026-01-28-dev-diary.pt.md","posts/2026-02-04-dev-diary.pt.md","posts/2026-02-11-dev-diary.pt.md","posts/2026-02-18-dev-diary.pt.md","posts/2026-02-25-dev-diary.pt.md","posts/2026-03-04-dev-diary.pt.md","posts/2026-03-11-dev-diary.pt.md","posts/2026-03-18-dev-diary.pt.md","posts/2026-03-25-dev-diary.pt.md","posts/2026-04-01-dev-diary.pt.md","posts/2026-04-08-dev-diary.pt.md","posts/2026-04-15-dev-diary.pt.md","posts/2026-04-22-dev-diary.pt.md","posts/2026-04-29-dev-diary.pt.md","posts/2026-05-06-dev-diary.pt.md","posts/2026-05-13-dev-diary.pt.md","posts/2026-05-20-dev-diary.pt.md","posts/2026-05-27-dev-diary.pt.md","posts/2026-06-03-dev-diary.pt.md","posts/2026-06-06-retrospective.pt.md","posts/2026-06-12-fable5-report.pt.md","posts/2026-06-13-arquitetura-e-metodologia.en.md","posts/2026-06-13-arquitetura-e-metodologia.pt.md","posts/2026-06-13-dev-diary.pt.md","posts/2026-06-30-dev-diary-transition.pt.md","posts/2026-07-08-dev-diary-ark-streams.pt.md","posts/2026-10-22-ai-factory-privacidade-por-arquitetura.pt.md","posts/2026-10-22-dev-diary-retrospectiva-trimestral.pt.md","posts.json","vite.svg"]),
	mimeTypes: {".txt":"text/plain",".svg":"image/svg+xml",".html":"text/html",".png":"image/png",".js":"text/javascript",".zip":"application/zip",".webp":"image/webp",".jpg":"image/jpeg",".md":"text/markdown",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.C_ZD8av_.js",app:"_app/immutable/entry/app.JVrBCLeW.js",imports:["_app/immutable/entry/start.C_ZD8av_.js","_app/immutable/chunks/B-7n3gE9.js","_app/immutable/chunks/B3lgn3wS.js","_app/immutable/entry/app.JVrBCLeW.js","_app/immutable/chunks/B3lgn3wS.js","_app/immutable/chunks/CDKvGexI.js","_app/immutable/chunks/CwwSj5oA.js","_app/immutable/chunks/DkmguOu6.js","_app/immutable/chunks/CIQOdlE1.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/__data.json","/about/","/trabalho/","/trabalho/__data.json","/blog/","/blog/__data.json","/links/","/trabalho/ai-factory/","/trabalho/ai-factory/__data.json","/trabalho/small-router/","/trabalho/small-router/__data.json","/trabalho/rohana/","/trabalho/rohana/__data.json","/trabalho/ark-streams/","/trabalho/ark-streams/__data.json","/blog/2026-10-22-ai-factory-privacidade-por-arquitetura/","/blog/2026-10-22-ai-factory-privacidade-por-arquitetura/__data.json","/blog/2026-10-22-dev-diary-retrospectiva-trimestral/","/blog/2026-10-22-dev-diary-retrospectiva-trimestral/__data.json","/blog/2026-07-08-dev-diary-ark-streams/","/blog/2026-07-08-dev-diary-ark-streams/__data.json","/blog/2026-06-30-dev-diary-transition/","/blog/2026-06-30-dev-diary-transition/__data.json","/blog/2026-06-13-arquitetura-e-metodologia/","/blog/2026-06-13-arquitetura-e-metodologia/__data.json","/blog/2026-06-13-dev-diary/","/blog/2026-06-13-dev-diary/__data.json","/blog/2026-06-12-fable5-report/","/blog/2026-06-12-fable5-report/__data.json","/blog/2026-06-06-retrospective/","/blog/2026-06-06-retrospective/__data.json","/blog/2026-05-20-dev-diary/","/blog/2026-05-20-dev-diary/__data.json","/blog/2026-04-22-dev-diary/","/blog/2026-04-22-dev-diary/__data.json","/blog/2026-03-25-dev-diary/","/blog/2026-03-25-dev-diary/__data.json","/blog/2026-02-25-dev-diary/","/blog/2026-02-25-dev-diary/__data.json","/blog/2026-02-11-dev-diary/","/blog/2026-02-11-dev-diary/__data.json","/blog/2026-01-28-dev-diary/","/blog/2026-01-28-dev-diary/__data.json","/blog/2026-01-07-dev-diary/","/blog/2026-01-07-dev-diary/__data.json","/trabalho/ark-engine/","/trabalho/ark-engine/__data.json","/trabalho/ark-terminal/","/trabalho/ark-terminal/__data.json","/trabalho/techsentry/","/trabalho/techsentry/__data.json","/trabalho/moleque-gateway-pagamentos/","/trabalho/moleque-gateway-pagamentos/__data.json","/trabalho/moleque-fexo/","/trabalho/moleque-fexo/__data.json","/trabalho/moleque-zougue-mpms/","/trabalho/moleque-zougue-mpms/__data.json","/trabalho/moleque-motor-pagamentos/","/trabalho/moleque-motor-pagamentos/__data.json","/trabalho/moleque-modulo-inteligencia/","/trabalho/moleque-modulo-inteligencia/__data.json","/trabalho/moleque-integracoes-pagamento/","/trabalho/moleque-integracoes-pagamento/__data.json"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
