export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".nojekyll","CNAME","images/avatar.svg","images/github-icon.svg","images/linkedin-icon.svg","images/portfolio-icon.svg","images/profile.jpg","images/twitter-icon.svg","images/weboasis-icon.svg","images/youtube-icon.svg","posts/2026-01-07-dev-diary.pt.md","posts/2026-01-14-dev-diary.pt.md","posts/2026-01-21-dev-diary.pt.md","posts/2026-01-28-dev-diary.pt.md","posts/2026-02-04-dev-diary.pt.md","posts/2026-02-11-dev-diary.pt.md","posts/2026-02-18-dev-diary.pt.md","posts/2026-02-25-dev-diary.pt.md","posts/2026-03-04-dev-diary.pt.md","posts/2026-03-11-dev-diary.pt.md","posts/2026-03-18-dev-diary.pt.md","posts/2026-03-25-dev-diary.pt.md","posts/2026-04-01-dev-diary.pt.md","posts/2026-04-08-dev-diary.pt.md","posts/2026-04-15-dev-diary.pt.md","posts/2026-04-22-dev-diary.pt.md","posts/2026-04-29-dev-diary.pt.md","posts/2026-05-06-dev-diary.pt.md","posts/2026-05-13-dev-diary.pt.md","posts/2026-05-20-dev-diary.pt.md","posts/2026-05-27-dev-diary.pt.md","posts/2026-06-03-dev-diary.pt.md","posts/2026-06-06-retrospective.pt.md","posts/2026-06-12-fable5-report.pt.md","posts/2026-06-13-dev-diary.pt.md","posts.json","vite.svg"]),
	mimeTypes: {".svg":"image/svg+xml",".jpg":"image/jpeg",".md":"text/markdown",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.DqpC2dtl.js",app:"_app/immutable/entry/app.BoI8Wi5t.js",imports:["_app/immutable/entry/start.DqpC2dtl.js","_app/immutable/chunks/B1pg-sMM.js","_app/immutable/chunks/CaxSk3-1.js","_app/immutable/chunks/Bz7mjz8e.js","_app/immutable/entry/app.BoI8Wi5t.js","_app/immutable/chunks/CaxSk3-1.js","_app/immutable/chunks/CpGxSSwm.js","_app/immutable/chunks/7CCYFUuh.js","_app/immutable/chunks/CTs4dAIr.js","_app/immutable/chunks/Bz7mjz8e.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/__data.json","/trabalho/","/trabalho/__data.json","/blog/","/blog/__data.json","/links/","/trabalho/clj-dialects/","/trabalho/clj-dialects/__data.json","/trabalho/techsentry/","/trabalho/techsentry/__data.json","/trabalho/ark-engine/","/trabalho/ark-engine/__data.json","/blog/2026-06-13-dev-diary/","/blog/2026-06-13-dev-diary/__data.json","/blog/2026-06-12-fable5-report/","/blog/2026-06-12-fable5-report/__data.json","/blog/2026-06-06-retrospective/","/blog/2026-06-06-retrospective/__data.json","/blog/2026-05-20-dev-diary/","/blog/2026-05-20-dev-diary/__data.json","/blog/2026-04-22-dev-diary/","/blog/2026-04-22-dev-diary/__data.json","/blog/2026-03-25-dev-diary/","/blog/2026-03-25-dev-diary/__data.json","/blog/2026-02-25-dev-diary/","/blog/2026-02-25-dev-diary/__data.json","/blog/2026-02-11-dev-diary/","/blog/2026-02-11-dev-diary/__data.json","/blog/2026-01-28-dev-diary/","/blog/2026-01-28-dev-diary/__data.json","/blog/2026-01-07-dev-diary/","/blog/2026-01-07-dev-diary/__data.json","/trabalho/ark-streams/","/trabalho/ark-streams/__data.json","/trabalho/notify-system/","/trabalho/notify-system/__data.json"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
