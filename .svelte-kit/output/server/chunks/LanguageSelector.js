import { S as fallback, K as attr, e as escape_html, V as slot, T as bind_props, Q as sanitize_props, R as spread_props, U as attr_style, I as head, p as pop, a as push, O as attr_class, W as clsx } from "./index.js";
import { c as currentLanguage } from "./simple-i18n.js";
function IconBase($$payload, $$props) {
  let title = fallback($$props["title"], null);
  let viewBox = $$props["viewBox"];
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg"${attr("viewBox", viewBox)} class="svelte-c8tyih">`;
  if (title) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<title>${escape_html(title)}</title>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></svg>`;
  bind_props($$props, { title, viewBox });
}
function FaMoon($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  IconBase($$payload, spread_props([
    { viewBox: "0 0 512 512" },
    $$sanitized_props,
    {
      children: ($$payload2) => {
        $$payload2.out += `<path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"></path>`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Icon($$payload, $$props) {
  let icon = $$props["icon"];
  let size = fallback($$props["size"], 24);
  let color = fallback($$props["color"], "currentColor");
  let ariaLabel = fallback($$props["ariaLabel"], "");
  const svelteIconsProps = {
    width: size,
    height: size,
    fill: color,
    style: `color: ${color};`
  };
  $$payload.out += `<div class="icon-wrapper svelte-1k44wz0"${attr_style(`width: ${size}px; height: ${size}px;`)}${attr("aria-label", ariaLabel)} role="img"><!---->`;
  icon?.($$payload, spread_props([svelteIconsProps]));
  $$payload.out += `<!----></div>`;
  bind_props($$props, { icon, size, color, ariaLabel });
}
function ThemeToggle($$payload, $$props) {
  push();
  let isDarkMode = false;
  head($$payload, ($$payload2) => {
    $$payload2.out += `<script>
    // Aplicar tema salvo no carregamento da página
    const mode = localStorage.getItem('mode') || 'light';
    document.documentElement.setAttribute('data-mode', mode);
  <\/script><!---->`;
  });
  $$payload.out += `<div class="theme-toggle-container svelte-me9lad"><button type="button" class="theme-toggle svelte-me9lad" id="theme-toggle"${attr("aria-pressed", isDarkMode)} aria-label="Alternar tema claro/escuro"><span class="icon svelte-me9lad">`;
  {
    $$payload.out += "<!--[!-->";
    Icon($$payload, {
      icon: FaMoon,
      size: 20,
      ariaLabel: "Tema escuro"
    });
  }
  $$payload.out += `<!--]--></span></button></div>`;
  pop();
}
function LanguageSelector($$payload, $$props) {
  push();
  let currentLocale = "pt";
  currentLanguage.subscribe((value) => {
    currentLocale = value;
  });
  $$payload.out += `<div class="language-selector svelte-1sh92id" role="group" aria-label="Seletor de idioma"><button${attr_class(clsx(currentLocale === "en" ? "active" : ""), "svelte-1sh92id")} aria-label="English"${attr("aria-pressed", currentLocale === "en")} type="button">EN</button> <button${attr_class(clsx(currentLocale === "pt" ? "active" : ""), "svelte-1sh92id")} aria-label="Português"${attr("aria-pressed", currentLocale === "pt")} type="button">PT</button> <button${attr_class(clsx(currentLocale === "es" ? "active" : ""), "svelte-1sh92id")} aria-label="Español"${attr("aria-pressed", currentLocale === "es")} type="button">ES</button></div>`;
  pop();
}
export {
  IconBase as I,
  LanguageSelector as L,
  ThemeToggle as T,
  Icon as a
};
