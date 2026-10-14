import "clsx";
import { a as attr, p as pop, b as push } from "../../chunks/index.js";
import { i as initSimpleI18n } from "../../chunks/simple-i18n.js";
import "marked";
function ChatWidget($$payload, $$props) {
  push();
  $$payload.out += `<div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="mb-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white dark:bg-white/90 dark:text-slate-900 text-xs font-semibold shadow-lg backdrop-blur border border-slate-700/50 dark:border-slate-200/50 animate-bounce"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Converse com a Rohana (IA)</div>`;
  }
  $$payload.out += `<!--]--> <button type="button" class="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500/30"${attr("aria-label", "Abrir chat com a Rohana")}>`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>`;
  }
  $$payload.out += `<!--]--> <span class="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></span></button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function _layout($$payload, $$props) {
  push();
  initSimpleI18n();
  let { children } = $$props;
  children($$payload);
  $$payload.out += `<!----> `;
  ChatWidget($$payload);
  $$payload.out += `<!---->`;
  pop();
}
export {
  _layout as default
};
