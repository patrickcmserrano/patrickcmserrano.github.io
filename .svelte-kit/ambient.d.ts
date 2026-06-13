
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const SVELTEKIT_FORK: string;
	export const NODE_ENV: string;
	export const MEMORY_PRESSURE_WRITE: string;
	export const LC_NUMERIC: string;
	export const npm_config_global_prefix: string;
	export const ANDROID_HOME: string;
	export const npm_execpath: string;
	export const PWD: string;
	export const npm_config_globalconfig: string;
	export const LC_IDENTIFICATION: string;
	export const KONSOLE_DBUS_SERVICE: string;
	export const LESSCLOSE: string;
	export const GOPATH: string;
	export const npm_lifecycle_event: string;
	export const LC_NAME: string;
	export const XDG_VTNR: string;
	export const ANTIGRAVITY_LS_ADDRESS: string;
	export const ANTIGRAVITY_PROJECT_ID: string;
	export const npm_lifecycle_script: string;
	export const SDKMAN_DIR: string;
	export const LS_COLORS: string;
	export const XDG_SESSION_DESKTOP: string;
	export const LC_PAPER: string;
	export const LC_TELEPHONE: string;
	export const npm_config_init_module: string;
	export const QT_ACCESSIBILITY: string;
	export const ANTIGRAVITY_CONVERSATION_ID: string;
	export const LANG: string;
	export const DISPLAY: string;
	export const XDG_RUNTIME_DIR: string;
	export const LC_ADDRESS: string;
	export const NODE: string;
	export const INVOCATION_ID: string;
	export const SDKMAN_CANDIDATES_DIR: string;
	export const KDE_SESSION_UID: string;
	export const ICEAUTHORITY: string;
	export const PATH: string;
	export const SHELL: string;
	export const npm_config_node_gyp: string;
	export const GTK2_RC_FILES: string;
	export const SESSION_MANAGER: string;
	export const KGLOBALACCELD_PLATFORM: string;
	export const SSH_AUTH_SOCK: string;
	export const LC_MONETARY: string;
	export const XDG_DATA_DIRS: string;
	export const KDE_SESSION_VERSION: string;
	export const LESSOPEN: string;
	export const NVM_INC: string;
	export const ANTIGRAVITY_TRAJECTORY_ID: string;
	export const LC_CTYPE: string;
	export const PAGER: string;
	export const XAUTHORITY: string;
	export const npm_config_local_prefix: string;
	export const KDE_APPLICATIONS_AS_SCOPE: string;
	export const HOME: string;
	export const npm_config_noproxy: string;
	export const npm_config_npm_version: string;
	export const DESKTOP_SESSION: string;
	export const KDE_FULL_SESSION: string;
	export const INIT_CWD: string;
	export const DEBUGINFOD_URLS: string;
	export const NVM_BIN: string;
	export const WINDOWID: string;
	export const SHLVL: string;
	export const npm_node_execpath: string;
	export const USER: string;
	export const SDKMAN_PLATFORM: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_package_json: string;
	export const KONSOLE_DBUS_WINDOW: string;
	export const JAVA_HOME: string;
	export const NVM_DIR: string;
	export const GTK_RC_FILES: string;
	export const SDKMAN_CANDIDATES_API: string;
	export const npm_config_save_exact: string;
	export const QT_WAYLAND_RECONNECT: string;
	export const PROFILEHOME: string;
	export const ANTIGRAVITY_CSRF_TOKEN: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const _: string;
	export const LANGUAGE: string;
	export const npm_command: string;
	export const GPG_AGENT_INFO: string;
	export const LOGNAME: string;
	export const SHELL_SESSION_ID: string;
	export const PAM_KWALLET5_LOGIN: string;
	export const XDG_SESSION_PATH: string;
	export const ANTIGRAVITY_SOURCE_METADATA: string;
	export const MANAGERPID: string;
	export const npm_config_user_agent: string;
	export const COLORTERM: string;
	export const NVM_CD_FLAGS: string;
	export const LC_TIME: string;
	export const XDG_SEAT_PATH: string;
	export const XDG_SESSION_TYPE: string;
	export const JOURNAL_STREAM: string;
	export const KONSOLE_VERSION: string;
	export const SYSTEMD_EXEC_PID: string;
	export const npm_package_version: string;
	export const XDG_SEAT: string;
	export const SSH_ASKPASS: string;
	export const EDITOR: string;
	export const GIT_PAGER: string;
	export const IM_CONFIG_PHASE: string;
	export const ANTIGRAVITY_AGENT: string;
	export const COLOR: string;
	export const WAYLAND_DISPLAY: string;
	export const LC_MEASUREMENT: string;
	export const XDG_MENU_PREFIX: string;
	export const npm_package_name: string;
	export const XKB_DEFAULT_LAYOUT: string;
	export const XKB_DEFAULT_MODEL: string;
	export const XDG_SESSION_CLASS: string;
	export const GTK_IM_MODULE: string;
	export const npm_config_prefix: string;
	export const KONSOLE_DBUS_SESSION: string;
	export const npm_config_userconfig: string;
	export const MEMORY_PRESSURE_WATCH: string;
	export const COLORFGBG: string;
	export const XDG_CONFIG_DIRS: string;
	export const SDKMAN_BROKER_API: string;
	export const TERM: string;
	export const XDG_SESSION_ID: string;
	export const npm_config_cache: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		SVELTEKIT_FORK: string;
		NODE_ENV: string;
		MEMORY_PRESSURE_WRITE: string;
		LC_NUMERIC: string;
		npm_config_global_prefix: string;
		ANDROID_HOME: string;
		npm_execpath: string;
		PWD: string;
		npm_config_globalconfig: string;
		LC_IDENTIFICATION: string;
		KONSOLE_DBUS_SERVICE: string;
		LESSCLOSE: string;
		GOPATH: string;
		npm_lifecycle_event: string;
		LC_NAME: string;
		XDG_VTNR: string;
		ANTIGRAVITY_LS_ADDRESS: string;
		ANTIGRAVITY_PROJECT_ID: string;
		npm_lifecycle_script: string;
		SDKMAN_DIR: string;
		LS_COLORS: string;
		XDG_SESSION_DESKTOP: string;
		LC_PAPER: string;
		LC_TELEPHONE: string;
		npm_config_init_module: string;
		QT_ACCESSIBILITY: string;
		ANTIGRAVITY_CONVERSATION_ID: string;
		LANG: string;
		DISPLAY: string;
		XDG_RUNTIME_DIR: string;
		LC_ADDRESS: string;
		NODE: string;
		INVOCATION_ID: string;
		SDKMAN_CANDIDATES_DIR: string;
		KDE_SESSION_UID: string;
		ICEAUTHORITY: string;
		PATH: string;
		SHELL: string;
		npm_config_node_gyp: string;
		GTK2_RC_FILES: string;
		SESSION_MANAGER: string;
		KGLOBALACCELD_PLATFORM: string;
		SSH_AUTH_SOCK: string;
		LC_MONETARY: string;
		XDG_DATA_DIRS: string;
		KDE_SESSION_VERSION: string;
		LESSOPEN: string;
		NVM_INC: string;
		ANTIGRAVITY_TRAJECTORY_ID: string;
		LC_CTYPE: string;
		PAGER: string;
		XAUTHORITY: string;
		npm_config_local_prefix: string;
		KDE_APPLICATIONS_AS_SCOPE: string;
		HOME: string;
		npm_config_noproxy: string;
		npm_config_npm_version: string;
		DESKTOP_SESSION: string;
		KDE_FULL_SESSION: string;
		INIT_CWD: string;
		DEBUGINFOD_URLS: string;
		NVM_BIN: string;
		WINDOWID: string;
		SHLVL: string;
		npm_node_execpath: string;
		USER: string;
		SDKMAN_PLATFORM: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_package_json: string;
		KONSOLE_DBUS_WINDOW: string;
		JAVA_HOME: string;
		NVM_DIR: string;
		GTK_RC_FILES: string;
		SDKMAN_CANDIDATES_API: string;
		npm_config_save_exact: string;
		QT_WAYLAND_RECONNECT: string;
		PROFILEHOME: string;
		ANTIGRAVITY_CSRF_TOKEN: string;
		XDG_CURRENT_DESKTOP: string;
		_: string;
		LANGUAGE: string;
		npm_command: string;
		GPG_AGENT_INFO: string;
		LOGNAME: string;
		SHELL_SESSION_ID: string;
		PAM_KWALLET5_LOGIN: string;
		XDG_SESSION_PATH: string;
		ANTIGRAVITY_SOURCE_METADATA: string;
		MANAGERPID: string;
		npm_config_user_agent: string;
		COLORTERM: string;
		NVM_CD_FLAGS: string;
		LC_TIME: string;
		XDG_SEAT_PATH: string;
		XDG_SESSION_TYPE: string;
		JOURNAL_STREAM: string;
		KONSOLE_VERSION: string;
		SYSTEMD_EXEC_PID: string;
		npm_package_version: string;
		XDG_SEAT: string;
		SSH_ASKPASS: string;
		EDITOR: string;
		GIT_PAGER: string;
		IM_CONFIG_PHASE: string;
		ANTIGRAVITY_AGENT: string;
		COLOR: string;
		WAYLAND_DISPLAY: string;
		LC_MEASUREMENT: string;
		XDG_MENU_PREFIX: string;
		npm_package_name: string;
		XKB_DEFAULT_LAYOUT: string;
		XKB_DEFAULT_MODEL: string;
		XDG_SESSION_CLASS: string;
		GTK_IM_MODULE: string;
		npm_config_prefix: string;
		KONSOLE_DBUS_SESSION: string;
		npm_config_userconfig: string;
		MEMORY_PRESSURE_WATCH: string;
		COLORFGBG: string;
		XDG_CONFIG_DIRS: string;
		SDKMAN_BROKER_API: string;
		TERM: string;
		XDG_SESSION_ID: string;
		npm_config_cache: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
