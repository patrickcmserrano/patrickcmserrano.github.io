
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/about" | "/about/components" | "/blog" | "/blog/[slug]" | "/links" | "/trabalho" | "/trabalho/[slug]";
		RouteParams(): {
			"/blog/[slug]": { slug: string };
			"/trabalho/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { slug?: string | undefined };
			"/about": Record<string, never>;
			"/about/components": Record<string, never>;
			"/blog": { slug?: string | undefined };
			"/blog/[slug]": { slug: string };
			"/links": Record<string, never>;
			"/trabalho": { slug?: string | undefined };
			"/trabalho/[slug]": { slug: string }
		};
		Pathname(): "/" | "/about/" | "/blog/" | `/blog/${string}` & {} | `/blog/${string}/` & {} | "/links/" | "/trabalho/" | `/trabalho/${string}` & {} | `/trabalho/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.nojekyll" | "/CNAME" | "/images/avatar.svg" | "/images/github-icon.svg" | "/images/linkedin-icon.svg" | "/images/portfolio-icon.svg" | "/images/profile.jpg" | "/images/profile_backup2.jpg" | "/images/twitter-icon.svg" | "/images/weboasis-icon.svg" | "/images/youtube-icon.svg" | "/posts/2026-01-07-dev-diary.pt.md" | "/posts/2026-01-14-dev-diary.pt.md" | "/posts/2026-01-21-dev-diary.pt.md" | "/posts/2026-01-28-dev-diary.pt.md" | "/posts/2026-02-04-dev-diary.pt.md" | "/posts/2026-02-11-dev-diary.pt.md" | "/posts/2026-02-18-dev-diary.pt.md" | "/posts/2026-02-25-dev-diary.pt.md" | "/posts/2026-03-04-dev-diary.pt.md" | "/posts/2026-03-11-dev-diary.pt.md" | "/posts/2026-03-18-dev-diary.pt.md" | "/posts/2026-03-25-dev-diary.pt.md" | "/posts/2026-04-01-dev-diary.pt.md" | "/posts/2026-04-08-dev-diary.pt.md" | "/posts/2026-04-15-dev-diary.pt.md" | "/posts/2026-04-22-dev-diary.pt.md" | "/posts/2026-04-29-dev-diary.pt.md" | "/posts/2026-05-06-dev-diary.pt.md" | "/posts/2026-05-13-dev-diary.pt.md" | "/posts/2026-05-20-dev-diary.pt.md" | "/posts/2026-05-27-dev-diary.pt.md" | "/posts/2026-06-03-dev-diary.pt.md" | "/posts/2026-06-06-retrospective.pt.md" | "/posts/2026-06-12-fable5-report.pt.md" | "/posts/2026-06-13-arquitetura-e-metodologia.en.md" | "/posts/2026-06-13-arquitetura-e-metodologia.pt.md" | "/posts/2026-06-13-dev-diary.pt.md" | "/posts.json" | "/vite.svg" | string & {};
	}
}